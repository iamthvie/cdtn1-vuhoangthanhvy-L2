// src/services/ticket.service.js
const ticketRepo = require('../repositories/ticket.repository');
const { toTicketView } = require('../contracts/ticket.contract');

class TicketService {
  async getAllTickets() {
    const rawTickets = await ticketRepo.findAll();
    return rawTickets.map(toTicketView);
  }

  async createTicket(data) {
    const rawTickets = await ticketRepo.findAll();
    const nextNumber = rawTickets.length + 123; 
    const formattedCode = `BH${String(nextNumber).padStart(6, '0')}/2026`;

    const ticketData = {
      ticket_code: data.ticket_code || data.ticketCode || formattedCode,
      device_id: Number(data.device_id || data.deviceId || 1),
      service_center_id: Number(data.service_center_id || data.serviceCenterId || 1),
      received_by: Number(data.received_by || data.receivedBy || 1),
      issue_desc: data.issue_desc || data.issueDesc || '',
      warranty_status: data.warranty_status || data.warrantyStatus || 'CON_BAO_HANH',
      status: data.status || 'MOI'
    };

    const created = await ticketRepo.create(ticketData);
    return toTicketView(created);
  }

  async searchDeviceBySerial(serial) {
    const deviceData = await ticketRepo.findDeviceBySerial(serial);
    if (!deviceData) {
      throw new Error('Không tìm thấy thiết bị với số serial/IMEI này trong CSDL!');
    }
    return deviceData;
  }
}

module.exports = new TicketService();