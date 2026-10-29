# Tiếp nhận và phân loại yêu cầu bảo hành - Mekong Mobile (Luồng L2)

**Sinh viên:** Vũ Hoàng Thanh Vy  
**MSSV:** 2374802010580  
**Lớp / Chuyên ngành:** Software Engineering (Track SE) - Đại học Văn Lang  

---

## 1. Giới thiệu hệ thống & Kiến trúc
- **Mô tả:** Hệ thống CRM quản lý và tiếp nhận yêu cầu bảo hành thiết bị di động (Luồng L2), số hóa toàn bộ quy trình từ ghi nhận thông tin khách hàng, quản lý thiết bị, lập phiếu yêu cầu (ticket) đến theo dõi lịch sử trạng thái xử lý.
- **Kiến trúc (3-Layer Architecture):** Tách biệt rõ ràng giữa 3 tầng (`routes` -> `services` -> `repositories`) kết hợp `contracts` (DTO/Sunset View) và `validators` (schema validation). *Lưu ý: Tầng service hoàn toàn độc lập, không chứa mã lệnh HTTP (req, res).*
- **Công nghệ sử dụng:** 
  - **Backend:** Node.js 20 LTS, Express.js
  - **Database:** PostgreSQL 16 (`mekong_crm_l2`) với `pg` native driver
  - **Testing:** Jest framework (Bộ kiểm thử tự động đạt 5/5 PASS)
  - **Frontend:** Native HTML5 / CSS3 Sunset Pastel Theme / Modern Vanilla JS

---

## 2. Yêu cầu môi trường (Prerequisites)
Trước khi cài đặt và chạy hệ thống, hãy đảm bảo máy tính đã cài đặt sẵn:
- **Node.js** (Phiên bản v18.x hoặc v20 LTS trở lên)
- **PostgreSQL** (Phiên bản v15 hoặc v16)
- **Git**

---

## 3. Cấu hình biến môi trường
1. Tại thư mục gốc của dự án, sao chép tệp mẫu `.env.example` thành tệp `.env`:
   ```bash
   cp .env.example .env