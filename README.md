# Tiếp nhận và phân loại yêu cầu bảo hành - Mekong Mobile

**Sinh viên:** Vũ Hoàng Thanh Vy - MSSV: 2374802010580  
**Học phần:** Chuyên đề Tốt nghiệp 1 (HK1 2026-2027)  
**Track:** SE  
**Luồng nghiệp vụ:** L2 - Tiếp nhận và phân loại yêu cầu bảo hành  

## 1. Mục tiêu
Nhân viên tiếp nhận tra cứu lịch sử sửa chữa trước đó của thiết bị bằng số serial/IMEI, xác thực tình trạng bảo hành (có sự phê duyệt của quản lý nếu mất hóa đơn/hết hạn), và ghi nhận chi tiết phụ kiện kèm theo cùng mô tả lỗi của khách.

## 2. Yêu cầu môi trường
- Node.js v20 LTS
- PostgreSQL 16

## 3. Hướng dẫn chạy
- `cp .env.example .env`
- `npm install`
- `npm run dev`

## 6. Trạng thái hiện tại
- [x] Khởi tạo project và chạy smoke test (Buổi 2)
- [ ] Module tiếp nhận yêu cầu (Buổi 8-10)
- [ ] Module phân công kỹ thuật viên / phê duyệt (Buổi 10-12)