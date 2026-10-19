// src/repositories/ticket.repository.js
const { Pool } = require('pg');

// Khởi tạo connection pool lấy chuỗi DATABASE_URL từ file .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1@localhost:5432/mekong_crm_l2'
});

class TicketRepository {
  // 1. Lấy danh sách tất cả phiếu bảo hành từ PostgreSQL
  async findAll() {
    const query = `
      SELECT 
        ticket_id, 
        ticket_code, 
        device_id, 
        issue_desc, 
        warranty_status, 
        status, 
        received_at 
      FROM ticket 
      WHERE is_deleted = false 
      ORDER BY received_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // 2. Tìm kiếm phiếu theo số serial/IMEI của thiết bị
  async findBySerial(serialNo) {
    const query = `
      SELECT t.* 
      FROM ticket t
      JOIN device d ON t.device_id = d.device_id
      WHERE d.serial_no = $1 AND t.is_deleted = false;
    `;
    const result = await pool.query(query, [serialNo]);
    return result.rows[0] || null;
  }

  // 3. Tạo phiếu bảo hành mới vào PostgreSQL
  async create(ticketData) {
    const query = `
      INSERT INTO ticket (
        ticket_code, 
        device_id, 
        service_center_id, 
        received_by, 
        issue_desc, 
        warranty_status, 
        status, 
        idempotency_key
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      ticketData.ticket_code,
      ticketData.device_id || 1,
      ticketData.service_center_id || 1,
      ticketData.received_by || 1024,
      ticketData.issue_desc,
      ticketData.warranty_status || 'CON_BAO_HANH',
      ticketData.status || 'MOI',
      ticketData.idempotency_key || require('crypto').randomUUID()
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = new TicketRepository();