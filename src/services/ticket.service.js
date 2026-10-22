// src/services/ticket.service.js
const ticketRepo = require('../repositories/ticket.repository');
const { toTicketView } = require('../contracts/ticket.contract');

class TicketService {
  async getAllTickets() {
    const rawTickets = await ticketRepo.findAll();
    return rawTickets.map(toTicketView);
  }

  /**
   * Kiểm tra quy tắc bảo hành QT-05
   */
  kiemTraConBaoHanh(device, ngayKiemTra) {
    if (!device || !device.ngayMua) {
      return { conBaoHanh: null, lyDo: 'CHUA_XAC_MINH_BAO_HANH' };
    }

    const ngayMuaDate = new Date(device.ngayMua);
    const ngayKiemTraDate = new Date(ngayKiemTra);
    
    const hanBaoHanhDate = new Date(ngayMuaDate);
    hanBaoHanhDate.setMonth(hanBaoHanhDate.getMonth() + (device.soThangBaoHanh || 12));

    if (ngayKiemTraDate <= hanBaoHanhDate) {
      return { conBaoHanh: true, lyDo: 'CON_BAO_HANH' };
    } else {
      return { conBaoHanh: false, lyDo: 'HET_BAO_HANH' };
    }
  }

  async createTicket(data) {
    const ticketData = {
      ticket_code: `BH${Math.floor(100000 + Math.random() * 900000)}/2026`,
      device_id: data.deviceId,
      issue_desc: data.issueDesc,
      warranty_status: data.warrantyStatus || 'CON_BAO_HANH',
      status: 'MOI'
    };

    const created = await ticketRepo.create(ticketData);
    return toTicketView(created);
  }
}

module.exports = new TicketService();