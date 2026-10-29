// src/repositories/ticket.repository.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mekong_crm_l2',
  password: '1', 
  port: 5432,
});

class TicketRepository {
  async findAll() {
    const query = `
      SELECT t.*, c.full_name AS customer_phone, c.phone 
      FROM ticket t
      LEFT JOIN device d ON t.device_id = d.device_id
      LEFT JOIN customer c ON d.customer_id = c.customer_id
      WHERE t.is_deleted = FALSE
      ORDER BY t.ticket_id DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async create(ticketData) {
    const query = `
      INSERT INTO ticket (ticket_code, device_id, service_center_id, received_by, issue_desc, warranty_status, status, idempotency_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7, gen_random_uuid())
      RETURNING *;
    `;
    const values = [
      ticketData.ticket_code,
      ticketData.device_id,
      ticketData.service_center_id,
      ticketData.received_by,
      ticketData.issue_desc,
      ticketData.warranty_status,
      ticketData.status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findDeviceBySerial(serial) {
    const query = `
      SELECT 
        d.device_id, d.serial_no, d.model_name, d.purchase_date, d.warranty_months,
        c.full_name, c.phone
      FROM device d
      JOIN customer c ON d.customer_id = c.customer_id
      WHERE d.serial_no ILIKE $1;
    `;
    const result = await pool.query(query, [`%${serial}%`]);
    if (result.rows.length === 0) return null;
    
    const device = result.rows[0];
    const ticketQuery = `
      SELECT ticket_code, received_at, issue_desc, status 
      FROM ticket 
      WHERE device_id = $1 AND is_deleted = FALSE 
      ORDER BY received_at DESC;
    `;
    const ticketsRes = await pool.query(ticketQuery, [device.device_id]);

    return {
      deviceId: device.device_id,
      serialNo: device.serial_no,
      modelName: device.model_name,
      purchaseDate: device.purchase_date,
      warrantyMonths: device.warranty_months,
      fullName: device.full_name,
      phone: device.phone,
      history: ticketsRes.rows
    };
  }
}

module.exports = new TicketRepository();