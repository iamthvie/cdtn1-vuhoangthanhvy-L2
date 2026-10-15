// src/repositories/ticket.repository.js
// Giả lập dữ liệu CSDL theo file seed để chạy thành công API Chặng 3 

const mockTickets = [
  {
    ticket_id: 1,
    ticket_code: "BH000123/2026",
    device_id: 1,
    issue_desc: "Màn hình chớp nháy liên tục",
    warranty_status: "CON_BAO_HANH",
    status: "MOI",
    received_at: "2026-10-15T08:30:00Z"
  },
  {
    ticket_id: 2,
    ticket_code: "BH000124/2026",
    device_id: 2,
    issue_desc: "Máy không xác định ngày mua, mất nguồn",
    warranty_status: "CHUA_XAC_MINH",
    status: "MOI",
    received_at: "2026-10-15T09:15:00Z"
  }
];

class TicketRepository {
  async findAll() {
    return mockTickets;
  }

  async findBySerial(serialNo) {
    return mockTickets.find(t => t.serial_no === serialNo) || null;
  }

  async create(ticketData) {
    const newTicket = {
      ticket_id: mockTickets.length + 1,
      ...ticketData,
      received_at: new Date().toISOString()
    };
    mockTickets.push(newTicket);
    return newTicket;
  }
}

module.exports = new TicketRepository();