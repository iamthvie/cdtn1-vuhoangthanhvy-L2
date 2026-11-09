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

  // ==========================================
  // BỔ SUNG ĐỂ ĐẠT CHUẨN CRUD (Khắc phục lỗi S1)
  // ==========================================
  
  // 1. Cập nhật thông tin / trạng thái phiếu bảo hành (Update)
  async updateTicket(id, data) {
    const updated = await ticketRepo.update(id, data);
    if (!updated) {
      throw new Error('Không tìm thấy phiếu bảo hành cần cập nhật trong CSDL!');
    }
    return toTicketView(updated);
  }

  // 2. Xóa phiếu bảo hành (Delete)
  async deleteTicket(id) {
    const deleted = await ticketRepo.delete(id);
    if (!deleted) {
      throw new Error('Không tìm thấy phiếu bảo hành cần xóa trong CSDL!');
    }
    return { message: 'Xóa phiếu thành công', id };
  }

  // ==========================================

  async searchDeviceBySerial(serial) {
    const deviceData = await ticketRepo.findDeviceBySerial(serial);
    if (!deviceData) {
      throw new Error('Không tìm thấy thiết bị với số serial/IMEI này trong CSDL!');
    }
    return deviceData;
  }

  // Hàm nghiệp vụ kiểm tra bảo hành phục vụ Unit Test
  kiemTraConBaoHanh(device, checkDateStr) {
    if (!device || !device.ngayMua) {
      return {
        conBaoHanh: null,
        lyDo: 'CHUA_XAC_MINH_BAO_HANH'
      };
    }

    const ngayMua = new Date(device.ngayMua);
    const ngayKiemTra = new Date(checkDateStr);
    const soThang = device.soThangBaoHanh || 12;

    const hanBaoHanh = new Date(ngayMua);
    hanBaoHanh.setMonth(hanBaoHanh.getMonth() + soThang);

    if (ngayKiemTra <= hanBaoHanh) {
      return {
        conBaoHanh: true,
        lyDo: 'CON_BAO_HANH'
      };
    } else {
      return {
        conBaoHanh: false,
        lyDo: 'HET_BAO_HANH'
      };
    }
  }
  
}

module.exports = new TicketService();