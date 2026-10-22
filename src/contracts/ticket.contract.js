// src/contracts/ticket.contract.js
/**
 * Hàm chuyển đổi ở ranh giới (toTicketView)
 * Chuyển đổi dữ liệu CSDL sang DTO cho client và che số điện thoại (QT-15)
 */
function toTicketView(ticket) {
  if (!ticket) return null;

  let customerPhone = ticket.customer_phone || ticket.phone || null;
  if (customerPhone && customerPhone.length >= 7) {
    customerPhone = customerPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  }

  return {
    ticketId: Number(ticket.ticket_id),
    ticketCode: ticket.ticket_code,
    deviceId: Number(ticket.device_id),
    customerPhone: customerPhone,
    issueDesc: ticket.issue_desc,
    warrantyStatus: ticket.warranty_status,
    status: ticket.status,
    receivedAt: ticket.received_at ? new Date(ticket.received_at).toISOString() : null
  };
}

module.exports = { toTicketView };