# Mekong Mobile CRM (Luồng L2 - Tổng Hợp BT1 & BT2)

Hệ thống quản lý và tiếp nhận phiếu bảo hành thiết bị di động (`Mekong Mobile CRM`) - **Luồng L2: Tiếp nhận và phân loại yêu cầu bảo hành**.  
Dự án được thực hiện cho học phần **Chuyên đề Tốt nghiệp 1**, tổng hợp toàn diện từ giai đoạn phân tích thiết kế, đặc tả yêu cầu (`Bài tập 1`) đến hiện thực hóa mã nguồn Backend/Frontend, cơ sở dữ liệu PostgreSQL và kiểm thử tự động (`Bài tập 2`).

---

## 📋 Mục Lục
1. [Thông Tin Sinh Viên](#1-thông-tin-sinh-viên)
2. [Tổng Quan Hệ Thống & Luồng L2](#2-tổng-quan-hệ-thống--luồng-l2)
3. [Cấu Trúc Thư Mục Dự Án](#3-cấu-trúc-thư-mục-dự-án)
4. [Kiến Trúc & Công Nghệ](#4-kiến-trúc--công-nghệ)
5. [Các Yêu Cầu Chức Năng & Quy Tắc Nghiệp Vụ](#5-các-yêu-cầu-chức-năng--quy-tắc-nghiệp-vụ)
6. [Hướng Dẫn Cài Đặt & Chạy Hệ Thống (Phép thử thư mục trống)](#6-hướng-dẫn-cài-đặt--chạy-hệ-thống-phép-thử-thư-mục-trống)
7. [Bộ Kiểm Thử (Unit Tests với Jest)](#7-bộ-kiểm-thử-unit-tests-với-jest)
8. [Tài Liệu & Minh Chứng Liên Quan (`docs/`)](#8-tài-liệu--minh-chứng-liên-quan-docs)

---

## 1. Thông Tin Sinh Viên
* **Họ và tên:** Vũ Hoàng Thanh Vy
* **MSSV:** 2374802010580
* **Giảng viên hướng dẫn:** TS. Nguyễn Trí Hải
* **Khoa/Trường:** Công nghệ Thông tin - Trường Đại học Văn Lang
* **GitHub Repository:** [iamthvie/cdtn1-vuhoangthanhvy-L2](https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2)

---

## 2. Tổng Quan Hệ Thống & Luồng L2
Mekong Mobile sở hữu 24 cửa hàng và 6 trung tâm bảo hành, tiếp nhận khoảng 260 yêu cầu bảo hành mỗi tháng. **Luồng L2** giải quyết bài toán:
* Tra cứu lịch sử sửa chữa thiết bị bằng số `serial/IMEI`.
* Xác thực tình trạng bảo hành tự động (`QT-05`) với cơ chế phê duyệt ngoại lệ (`FR5`, `FR6`, `FR7`).
* Ghi nhận mô tả lỗi chi tiết, quản lý phụ kiện kèm theo (`FR4`) và cảnh báo sửa lặp lại khi thiết bị có từ 2 phiếu bảo hành trước trở lên (`FR8`).

---

## 3. Cấu Trúc Thư Mục Dự Án

```text
cdtn1-vuhoangthanhvy-L2/
│
├── data/                      # Thứa chứa file CSV thực tế (tickets_history.csv, ...)
├── docs/                      # Tài liệu phân tích thiết kế BT1 & sơ đồ minh chứng
│   ├── screenshots/           # Ảnh chụp màn hình giao diện & kết quả test
│   ├── ai-disclosure.md       # Bảng khai báo sử dụng AI (BT1 & BT2)
│   ├── api-docs.md            # Tài liệu API endpoints
│   ├── architecture.drawio    # Sơ đồ kiến trúc phân lớp
│   ├── erd.drawio             # Sơ đồ thực thể kết hợp (6 bảng)
│   ├── srs.md                 # Đặc tả yêu cầu phần mềm
│   ├── bug-log.md             # Nhật ký sửa lỗi
│   ├── test-plan.md           # Kế hoạch kiểm thử
│   ├── test-report.md         # Báo cáo kiểm thử
│   └── thay-doi-thiet-ke.md   # Ghi nhận thay đổi thiết kế từ BT1 sang BT2
│
├── migrations/                # Script khởi tạo cơ sở dữ liệu quan hệ
│   └── 001_create_12_tables.sql
│
├── public/                    # Giao diện Frontend (3 màn hình độc lập hoàn toàn)
│   ├── login.html             # Màn hình 1: Đăng nhập phân quyền
│   ├── index.html             # Màn hình 2: Quản lý danh sách, tra cứu, tiếp nhận phiếu
│   └── approval.html          # Màn hình 3: Quản lý phê duyệt yêu cầu (Dành cho Quản lý)
│
├── src/                       # Mã nguồn Backend (Layered Architecture)
│   ├── contracts/             # Ánh xạ hợp đồng dữ liệu (toTicketView)
│   ├── repositories/          # Tầng thao tác CSDL PostgreSQL (Pool query)
│   ├── routes/                # Tầng định tuyến API Backend
│   ├── services/              # Tầng xử lý logic nghiệp vụ (QT-05, kiểm tra trùng lặp)
│   └── index.js               # Điểm khởi chạy Server Express.js
│
├── tests/                     # Bộ kiểm thử tự động viết bằng Jest
│   ├── ticket.contract.test.js
│   └── ticket.service.test.js
│
├── import_csv.js              # Script tự động làm sạch & nạp dữ liệu chống trùng lặp (ON CONFLICT)
├── package.json
└── README.md
```

---

## 4. Kiến Trúc & Công Nghệ
* **Backend:** Node.js, Express.js (Mô hình phân tầng: `Routes` $\rightarrow$ `Services` $\rightarrow$ `Repositories`).
* **Database:** PostgreSQL (Hệ quản trị cơ sở dữ liệu quan hệ với 6 bảng cốt lõi: `customer`, `device`, `ticket`, `ticket_accessory`, `approval_request`, `ticket_status_log`).
* **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid, biến `--root`), Vanilla JavaScript, FontAwesome, Google Fonts (`Plus Jakarta Sans`).
* **Bảo mật & Phân quyền:** Xác thực vai trò thông qua `sessionStorage`, che số điện thoại khách hàng (`QT-15` / `NFR2`), cơ chế `Idempotency-Key` đảm bảo tính tin cậy giao dịch (`NFR4`).

---

## 5. Các Yêu Cầu Chức Năng & Quy Tắc Nghiệp Vụ
* **`FR1` & `QT-03`:** Tra cứu thông tin thiết bị, chủ sở hữu và lịch sử bảo hành bằng Serial/IMEI.
* **`FR2` & `QT-05`:** Tự động tính toán tình trạng bảo hành (`CON_BAO_HANH`, `HET_BAO_HANH`, `CHUA_XAC_MINH`).
* **`FR3` & `QT-06`:** Ghi nhận mô tả lỗi (tối thiểu 10 ký tự), tự động sinh mã phiếu ở trạng thái `Mới`.
* **`FR4`:** Quản lý phụ kiện đi kèm chuẩn hóa (Sạc, Tai nghe, Hộp, Khác kèm ghi chú bắt buộc).
* **`FR5`, `FR6`, `FR7` & `BR-A1`:** Cơ chế đề nghị phê duyệt ngoại lệ và xử lý danh sách chờ cho Quản lý (bắt buộc nhập lý do khi từ chối).
* **`FR8` & `BR-A2`:** Cảnh báo tự động khi thiết bị có từ 2 phiếu bảo hành trước đó.
* **`FR9`:** Hỗ trợ nhân viên lọc nhanh danh sách phiếu do chính mình tiếp nhận trong ngày.

---

## 6. Hướng Dẫn Cài Đặt & Chạy Hệ Thống (Phép thử thư mục trống)

Để dựng lại toàn bộ hệ thống từ đầu trên máy cá nhân, thực hiện các bước sau:

### Bước 1: Clone repository về máy và di chuyển vào thư mục dự án
```bash
git clone https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2
cd cdtn1-vuhoangthanhvy-L2
```

### Bước 2: Cài đặt các gói thư viện phụ thuộc
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo tệp `.env` từ tệp mẫu `.env.example` và cấu hình chuỗi kết nối PostgreSQL của bạn:
```bash
cp .env.example .env
```

### Bước 4: Khởi tạo Cơ sở dữ liệu và Migration
Mở PostgreSQL client hoặc dòng lệnh psql và thực hiện:
```sql
CREATE DATABASE mekong_crm_12;
```
Chạy file migration để tạo bảng:
```bash
node migrations/001_create_12_tables.sql
```

### Bước 5: Nạp dữ liệu mẫu tự động từ Dataset
```bash
node import_csv.js
```

### Bước 6: Khởi chạy ứng dụng (Server)
Chạy chế độ phát triển:
```bash
npm run dev
```
Hoặc khởi chạy thông thường:
```bash
npm start
```

### Bước 7: Trải nghiệm trên trình duyệt
Mở trình duyệt web và truy cập:  
👉 **`http://localhost:3000`** (Hệ thống sẽ tự động hiển thị màn hình Đăng nhập `login.html`).

---

## 7. Bộ Kiểm Thử (Unit Tests với Jest)

Hệ thống tích hợp bộ kiểm thử tự động sử dụng Jest, kiểm tra hợp đồng dữ liệu (`Contract`) và quy tắc nghiệp vụ (`QT-05`).

Chạy kiểm thử:
```bash
npm test
```
*(Trên môi trường Windows PowerShell, có thể dùng: `npm.cmd test`)*

Kết quả kiểm thử đạt **100% PASS** (`5/5 tests` trên 2 test suites: `ticket.service.test.js` và `ticket.contract.test.js`).

---

## 8. Tài Liệu & Minh Chứng Liên Quan (`docs/`)
Toàn bộ tài liệu đặc tả, sơ đồ thiết kế kiến trúc, nhật ký lỗi và báo cáo kiểm thử nằm trong thư mục `docs/`:
* `docs/srs.md`: Đặc tả yêu cầu phần mềm chi tiết.
* `docs/architecture.drawio`: Sơ đồ kiến trúc phân lớp hệ thống.
* `docs/erd.drawio`: Sơ đồ thực thể kết hợp (ERD 6 bảng).
* `docs/usecase.drawio`: Sơ đồ Use Case phân tích chức năng.
* `docs/bug-log.md`: Nhật ký ghi nhận và sửa lỗi.
* `docs/test-plan.md` & `docs/test-report.md`: Kế hoạch và báo cáo kết quả kiểm thử.
* `docs/ai-disclosure.md`: Bảng khai báo sử dụng công cụ AI hỗ trợ.

---
© **2026** - Phát triển bởi **Vũ Hoàng Thanh Vy** | Đồ án Chuyên đề Tốt nghiệp 1 - Khoa CNTT, Đại học Văn Lang.