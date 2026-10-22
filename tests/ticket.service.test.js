// tests/ticket.service.test.js
const ticketService = require('../src/services/ticket.service');

describe('Kiem tra Quy tac nghiep vu QT-05 (Con bao hanh hay khong)', () => {
  test('3. Luong dung: Con bao hanh khi ngay kiem tra trong thoi han', () => {
    const device = { ngayMua: '2026-01-15', soThangBaoHanh: 12 };
    const result = ticketService.kiemTraConBaoHanh(device, '2026-09-08');
    
    expect(result.conBaoHanh).toBe(true);
    expect(result.lyDo).toBe('CON_BAO_HANH');
  });

  test('4. Luong sai: Het bao hanh khi ngay kiem tra vuot qua thoi han', () => {
    const device = { ngayMua: '2024-01-15', soThangBaoHanh: 12 };
    const result = ticketService.kiemTraConBaoHanh(device, '2026-09-08');

    expect(result.conBaoHanh).toBe(false);
    expect(result.lyDo).toBe('HET_BAO_HANH');
  });

  test('5. Truong hop BIEN: Chua xac minh duoc khi thieu ngay mua', () => {
    const device = { ngayMua: null, soThangBaoHanh: 12 };
    const result = ticketService.kiemTraConBaoHanh(device, '2026-09-08');

    expect(result.conBaoHanh).toBeNull();
    expect(result.lyDo).toBe('CHUA_XAC_MINH_BAO_HANH');
  });
});