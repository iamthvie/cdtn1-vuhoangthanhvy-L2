// src/validators/ticket.schema.js
/**
 * Kiểm tra dữ liệu đầu vào khi tạo phiếu bảo hành mới (QT-06/FR3)
 */
function validateCreateTicket(body) {
  const errors = {};

  if (!body.issueDesc || typeof body.issueDesc !== 'string' || body.issueDesc.trim().length < 10) {
    errors.issueDesc = 'Mô tả lỗi phải từ 10 ký tự trở lên (QT-06/FR3)';
  }

  if (!body.deviceId || isNaN(Number(body.deviceId))) {
    errors.deviceId = 'Mã thiết bị không hợp lệ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = { validateCreateTicket };