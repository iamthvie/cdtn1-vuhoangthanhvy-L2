# Test Plan - Mekong Mobile CRM (Flow L2: Tiếp nhận bảo hành)

## 1. Scope (Phạm vi kiểm thử)
* **Phần kiểm thử (What is tested):** 
  * Chức năng tra cứu thiết bị và lịch sử bảo hành theo Serial/IMEI.
  * Quy tắc xác định tình trạng bảo hành QT-05 (Còn bảo hành, Hết bảo hành, Chưa xác minh bảo hành).
  * Chức năng tạo phiếu bảo hành mới trạng thái MOI kèm chọn phụ kiện.
  * Cơ chế chặn phiếu trùng / cảnh báo sửa lặp lại thiết bị từ 2 phiếu trước.
  * Phân quyền và che số điện thoại khách hàng theo quy tắc QT-15 (NFR2).
* **Phần chủ ý không kiểm và lý do (What is NOT tested):** 
  * Không kiểm thử hiệu năng chịu tải (Performance/Load testing) vì phần này thuộc phạm vi của Chuyên đề tốt nghiệp 2.
  * Không kiểm tra màn hình cấu hình hệ thống vì chỉ là tính năng tĩnh, không có quy tắc nghiệp vụ cốt lõi.

## 2. Test Types & Quantity (Loại test và số lượng)
Tổng số lượng dự kiến: **12 test cases** phân bổ theo mô hình Kim tháp kiểm thử:
* **Unit Tests (7 tests):** Kiểm thử các hàm logic nghiệp vụ đơn lẻ (như logic kiểm tra hạn bảo hành QT-05, format che số điện thoại QT-15) tách rời hoàn toàn khỏi CSDL.
* **Integration Tests (2 tests):** Kiểm thử tầng Service kết hợp với Repository và CSDL PostgreSQL local thật.
* **API / System Tests (3 tests):** Kiểm thử luồng gọi API qua Supertest/Express từ đầu tới cuối (`POST /api/tickets`, tra cứu thiết bị, phân quyền).
* **Kỹ thuật chọn dữ liệu:** Áp dụng phương pháp Phân vùng tương đương (Equivalence Partitioning) và Giá trị biên (Boundary Value Analysis) cho các mốc thời gian bảo hành (QT-05) và độ dài mô tả lỗi. Đảm bảo đủ 5 loại test yêu cầu (Luồng đúng, Giá trị biên, Dữ liệu sai, Bảo mật, Tái lập).

## 3. Success Criteria (Tiêu chí thành công đo được)
* 100% (12/12) test cases được chạy thực tế và ghi nhận kết quả rõ ràng trong Test Report.
* Mỗi quy tắc nghiệp vụ đã hiện thực (QT-03, QT-05, QT-14, QT-15) phải có ít nhất 01 test case kiểm chứng tương ứng.
* Không còn bất kỳ lỗi mức Critical nào đang mở; mọi lỗi mức Major còn lại phải có giải trình lý do và hướng xử lý rõ ràng.

## 4. Environment & Test Data (Môi trường và dữ liệu thử)
* **Môi trường chạy test:** Chạy trực tiếp trên môi trường Node.js local của máy thông qua lệnh kiểm thử tự động (`npm test`).
* **Dữ liệu thử (Test Fixtures):** Sử dụng tập dữ liệu mẫu chuẩn (gồm các bản ghi khách hàng, thiết bị và lịch sử phiếu bảo hành mẫu trong CSDL PostgreSQL local).
* **Cơ chế dọn dẹp:** Hàm `resetDb()` được cấu hình tự động chạy trước mỗi test case để đảm bảo tính độc lập.