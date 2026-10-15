// src/services/ticket.service.js
const ticketRepo = require('../repositories/ticket.repository');

class TicketService {
  async getAllTickets() {
    return await ticketRepo.findAll();
  }

  async createTicket(data) {
    if (!data.issueDesc || data.issueDesc.trim().length < 10) {
      const error = new Error('Mô tả lỗi phải từ 10 ký tự trở lên (QT-06/FR3)');
      error.statusCode = 400;
      throw error;
    }

    const ticketData = {
      ticket_code: `BH${Math.floor(100000 + Math.random() * 900000)}/2026`,
      device_id: data.deviceId || 1,
      issue_desc: data.issueDesc,
      warranty_status: data.warrantyStatus || 'CON_BAO_HANH',
      status: 'MOI'
    };

    return await ticketRepo.create(ticketData);
  }
}

module.exports = new TicketService();