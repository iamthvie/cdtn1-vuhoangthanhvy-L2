// tests/ticket.contract.test.js
const { toTicketView } = require('../src/contracts/ticket.contract');

describe('Test Hop dong du lieu - toTicketView', () => {
  test('1. Tra dung cac truong va kieu du lieu trong hop dong', () => {
    const rawData = {
      ticket_id: 1,
      ticket_code: 'BH000123/2026',
      device_id: 2,
      issue_desc: 'Màn hình bị sọc',
      warranty_status: 'CON_BAO_HANH',
      status: 'MỚI',
      received_at: '2026-10-15T08:30:00Z'
    };

    const view = toTicketView(rawData);

    expect(view).toHaveProperty('ticketId', 1);
    expect(view).toHaveProperty('ticketCode', 'BH000123/2026');
    expect(view).toHaveProperty('issueDesc', 'Màn hình bị sọc');
  });

  test('2. QT-15: Che so dien thoai khach hang khi tra ve View', () => {
    const rawData = {
      ticket_id: 1,
      phone: '0912345678',
      issue_desc: 'Lỗi nguồn'
    };

    const view = toTicketView(rawData);
    expect(view.customerPhone).toBe('091****678');
  });
});