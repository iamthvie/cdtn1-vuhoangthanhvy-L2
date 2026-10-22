# Tiếp nhận và phân loại yêu cầu bảo hành - Mekong Mobile (Luồng L2)

**Sinh viên:** Vũ Hoàng Thanh Vy  
**MSSV:** 2374802010580  
**Lớp / Chuyên ngành:** Software Engineering (Track SE) - Đại học Văn Lang  

---

## 1. Kiến trúc hệ thống & Công nghệ
- **Architecture:** 3-Layer Architecture (`routes` -> `services` -> `repositories`) kết hợp `contracts` (DTO/Sunset View) và `validators` (schema validation).
- **Backend:** Node.js 20 LTS, Express.js
- **Database:** PostgreSQL 16 (`mekong_crm_l2`) với `pg` native driver
- **Testing:** Jest framework (5/5 Unit Tests PASS)
- **Frontend:** Native HTML5 / CSS3 Sunset Pastel Theme / Modern Vanilla JS

---

## 2. Yêu cầu môi trường
- Node.js 20 LTS, npm 10
- PostgreSQL 16
- Biến môi trường: xem tệp `.env.example`

---

## 3. Hướng dẫn chạy hệ thống (End-to-End)
Chạy các lệnh sau tại thư mục gốc dự án:

1. **Cấu hình môi trường:**
   `cp .env.example .env`
2. **Cài đặt thư viện:**
   `npm install`
3. **Chạy Server Backend & Frontend:**
   `npm run dev`
   *(Truy cập giao diện tại: http://localhost:3000)*
4. **Chạy bộ 5 Unit Tests:**
   `npm test`

---

## 4. Dữ liệu mẫu (Dataset)
Dự án đã tích hợp các file CSDL danh mục chuẩn từ bộ dataset Mekong Mobile tại thư mục `data/`:
- `data/service_centers.csv`
- `data/technicians.csv`
- `data/issue_categories.csv`

---

## 5. Minh chứng kết quả (Docs)
- `docs/result_buoi10.png`: Ảnh chụp màn hình giao diện Web 3 màn hình gọi API thật từ PostgreSQL.
- `docs/test_results_buoi10.png`: Ảnh chụp kết quả chạy `npm test` thành công 5/5 PASS.
- `docs/thay-doi-thiet-ke.md`: Nhật ký ghi nhận các điều chỉnh thiết kế.

---

## 6. Trạng thái hiện tại (Buổi 10 - Sprint 2)
- [x] Đã ghi nhận điều chỉnh thiết kế tại `docs/thay-doi-thiet-ke.md`
- [x] Phân lớp hoàn chỉnh: `routes`, `services`, `repositories`, `contracts`, `validators`
- [x] Kết nối và thực thi CSDL PostgreSQL 16 thật
- [x] Xây dựng Hợp đồng dữ liệu `toTicketView` & áp dụng QT-15 (che số điện thoại)
- [x] Xử lý đủ 3 trạng thái API & Frontend: Đang tải (Loading), Rỗng (Empty), Lỗi (Error)
- [x] Giao diện Frontend 3 màn hình (Danh sách, Tiếp nhận, Chi tiết) kết nối API thật
- [x] Viết 5 Unit Tests PASS (Đủ 3 loại: Luồng đúng, Luồng sai, Trường hợp biên)
- [x] Luồng chính chạy End-to-End không lỗi treo