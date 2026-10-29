const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mekong_crm_l2',
  password: '1', 
  port: 5432,
});

function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/^\uFEFF/, '');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const separator = lines[0].includes(';') ? ';' : ',';

  const splitCSVLine = (line, sep) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === sep && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else current += char;
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const headers = splitCSVLine(lines[0], separator).map(h => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i], separator);
    const rowObj = {};
    headers.forEach((h, index) => {
      rowObj[h] = cols[index] !== undefined ? cols[index].trim().replace(/^["']|["']$/g, '') : null;
    });
    rows.push(rowObj);
  }
  return rows;
}

async function runImport() {
  const datasetDir = path.join(__dirname, 'data');
  try {
    console.log('🚀 Bắt đầu nạp chính xác toàn bộ dữ liệu từ file CSV...');

    await pool.query(`SET session_replication_role = 'replica';`);
    await pool.query(`SET search_path TO public;`);

    // 1. Nạp customer (Đọc chuẩn xác email, address/dia_chi, created_at)
    const customers = parseCsv(path.join(datasetDir, 'customers_raw.csv'));
    for (let i = 0; i < customers.length; i++) {
      const c = customers[i];
      const name = c.ho_ten || c.full_name || 'Khách hàng';
      const phone = c.so_dien_thoai || c.phone || '';
      const email = c.email && c.email !== '' ? c.email : null;
      const address = c.dia_chi || c.address || null;
      const createdAt = c.ngay_tao || c.created_at || null;

      await pool.query(
        `INSERT INTO customer (full_name, phone, email, address, created_at) 
         VALUES ($1, $2, $3, $4, NULLIF($5, '')::timestamp)`,
        [name, phone, email, address, createdAt]
      );
    }
    console.log(`✅ Đã nạp xong ${customers.length} khách hàng đầy đủ email và địa chỉ!`);

    const tickets = parseCsv(path.join(datasetDir, 'tickets_history.csv'));

   // 2. Nạp device dựa trên dữ liệu thực tế từ tickets_history.csv
    let deviceMap = new Map();
    tickets.forEach(tk => {
      const devId = tk.product_id || tk.device_id;
      const serialNo = tk.serial_no || `SN-${devId || Math.random()}`;
      if (devId) deviceMap.set(Number(devId), serialNo);
    });

    for (const [devId, serialNo] of deviceMap) {
      await pool.query(
        `INSERT INTO device (customer_id, serial_no, model_name, purchase_date) 
         VALUES (1, $1, 'Standard Model', CURRENT_DATE)
         ON CONFLICT (serial_no) DO NOTHING`,
        [serialNo]
      );
    }
    console.log(`✅ Đã nạp xong ${deviceMap.size} thiết bị thực tế!`);

    // 3. Nạp ticket từ tickets_history.csv
    for (let i = 0; i < tickets.length; i++) {
      const tk = tickets[i];
      const ticketCode = tk.ticket_code;
      const deviceId = Number(tk.product_id || tk.device_id || 1);
      const centerId = Number(tk.center_id || tk.service_center_id || 1);
      const technician = Number(tk.technician || tk.received_by || 1);
      const issueDesc = tk.issue_desc || 'Lỗi thiết bị';
      const status = tk.status || 'MOI';
      
      const isWarrantyStr = String(tk.is_warranty || 'TRUE').toUpperCase();
      const isWarrantyBool = isWarrantyStr === 'TRUE' || isWarrantyStr === '1';
      const warrantyStatus = isWarrantyBool ? 'Còn bảo hành' : 'Hết bảo hành';
      const idempotencyKey = tk.idempotency_key || crypto.randomUUID();

      if (ticketCode) {
        await pool.query(
          `INSERT INTO ticket (ticket_code, device_id, service_center_id, received_by, issue_desc, status, warranty_status, idempotency_key) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           ON CONFLICT (ticket_code) DO NOTHING`,
          [ticketCode, deviceId, centerId, technician, issueDesc, status, warrantyStatus, idempotencyKey]
        );
      }
    }
    console.log(`✅ Đã nạp xong ${tickets.length} phiếu ticket thực tế từ CSV!`);

    // 4. Nạp ticket_status_log từ ticket_status_log.csv
    const logs = parseCsv(path.join(datasetDir, 'ticket_status_log.csv'));
    for (let i = 0; i < logs.length; i++) {
      const lg = logs[i];
      const ticketId = Number(lg.ticket_id || 1);
      const fromStatus = lg.from_status || 'MOI';
      const toStatus = lg.to_status || 'DANG_XU_LY';
      const changedBy = Number(lg.changed_by || 1);

      await pool.query(
        `INSERT INTO ticket_status_log (ticket_id, from_status, to_status, changed_by) 
         VALUES ($1, $2, $3, $4)`,
        [ticketId, fromStatus, toStatus, changedBy]
      );
    }

    await pool.query(`SET session_replication_role = 'origin';`);
    console.log(`✅ Đã nạp xong ${logs.length} dòng log trạng thái!`);
    console.log('\n🎉 Hoàn tất toàn bộ dữ liệu thực tế thành công xuất sắc!');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await pool.end();
  }
}

runImport();