// src/contracts/ticket.contract.js
/**
 * Hàm chuyển đổi ở ranh giới (toTicketView)
 * Chuyển đổi dữ liệu CSDL sang DTO cho client và che số điện thoại (QT-15)
 */
function toTicketView(ticket) {
  if (!ticket) return null;

  // Lấy số điện thoại từ CSDL hoặc dùng số mặc định để test quy tắc QT-15
  let customerPhone = ticket.customer_phone || ticket.phone || '0912345678';
  
  if (customerPhone && customerPhone.length >= 7) {
    // Regex che 4 số giữa: 0912345678 -> 091****678
    customerPhone = customerPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  }

  return {
    ticketId: Number(ticket.ticket_id || ticket.ticketId || 1),
    ticketCode: ticket.ticket_code || ticket.ticketCode,
    deviceId: Number(ticket.device_id || ticket.deviceId),
    customerPhone: customerPhone,
    issueDesc: ticket.issue_desc || ticket.issueDesc,
    warrantyStatus: ticket.warranty_status || ticket.warrantyStatus || 'CON_BAO_HANH',
    status: ticket.status || 'MOI',
    receivedAt: ticket.received_at ? new Date(ticket.received_at).toISOString() : new Date().toISOString()
  };
}

module.exports = { toTicketView };