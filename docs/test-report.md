# Test Report - Mekong Mobile CRM (Flow L2: Tiếp nhận bảo hành)

## Tổng quan phân bổ 12 Test Cases theo 5 loại:
1. **Luồng đúng (4 tests):** TC-01, TC-02, TC-03, TC-04 (Kiểm chứng các quy tắc QT-05, QT-03, FR1, FR3).
2. **Giá trị biên (2 tests):** TC-05, TC-06 (Kiểm chứng ranh giới thời hạn QT-05 và độ dài mô tả lỗi FR3).
3. **Dữ liệu sai (3 tests):** TC-07, TC-08, TC-09 (Kiểm chứng mã lỗi HTTP 400, 404, 403 trên UI).
4. **Bảo mật & Chất lượng dữ liệu (2 tests):** TC-10, TC-11 (Kiểm chứng phân quyền trung tâm QT-14 và che số điện thoại QT-15).
5. **Tính tái lập (1 test):** TC-12 (Kiểm chứng chạy migration và seed lần 2 không lỗi).

---

## Chi tiết 12 Test Cases (Đủ 8 cột)

### TC-01: Tra cứu thiết bị và lịch sử theo Serial/IMEI hợp lệ (Luồng đúng - FR1)
- **1. Mã:** TC-01
- **2. Tiền điều kiện:** CSDL đã có dữ liệu thiết bị với Serial `SN457332677691`, thuộc khách hàng `Phan Hữu Bình`, có sẵn 2 phiếu bảo hành cũ.
- **3. Các bước:** Truy cập giao diện tra cứu, nhập Serial vào ô tìm kiếm và bấm nút tra cứu thiết bị.
- **4. Dữ liệu thử:** `serialNo: "SN457332677691"`
- **5. Kết quả mong đợi:** Giao diện hiển thị thông tin thiết bị, tên chủ sở hữu, số điện thoại đã che dạng `076****885` (QT-15) và danh sách lịch sử 2 phiếu cũ.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Giao diện hiển thị đúng thông tin, số điện thoại được che chuẩn QT-15, lịch sử trả về đủ 2 phiếu. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-01.png`

### TC-02: Xác định thiết bị còn bảo hành theo QT-05 (Luồng đúng - FR2)
- **1. Mã:** TC-02
- **2. Tiền điều kiện:** Thiết bị mua ngày `2026-03-01`, thời hạn bảo hành mặc định `12 tháng`.
- **3. Các bước:** Gửi request `POST /api/tickets` qua Postman với ngày tiếp nhận nằm trong hạn bảo hành.
- **4. Dữ liệu thử:** Ngày tiếp nhận: `2027-02-28`.
- **5. Kết quả mong đợi:** Hệ thống tự động tính toán và gán trạng thái bảo hành `warranty_status = 'CON_BAO_HANH'`.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Phản hồi JSON trên Postman trả về mã `201 Created` và trạng thái ghi nhận trong CSDL chính xác là 'CON_BAO_HANH'. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-02.png`

### TC-03: Tạo phiếu bảo hành mới thành công ở trạng thái Mới (Luồng đúng - FR3)
- **1. Mã:** TC-03
- **2. Tiền điều kiện:** API backend đang hoạt động, thiết bị tồn tại và hợp lệ.
- **3. Các bước:** Gửi request `POST /api/tickets` qua Postman với dữ liệu JSON đầy đủ thông tin bắt buộc.
- **4. Dữ liệu thử:** `{ deviceId: 1, serviceCenterId: 1, receivedBy: 1024, issueDesc: "Màn hình bị sọc ngang khi sử dụng", warrantyStatus: "CON_BAO_HANH" }`
- **5. Kết quả mong đợi:** Postman trả về mã `201 Created`, sinh mã phiếu duy nhất (ví dụ `BH135521/2026`), lưu phiếu ở trạng thái `MOI`.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Postman phản hồi thành công `201 Created`, mã phiếu được sinh chuẩn định dạng, status là 'MOI'. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-03.png`

### TC-04: Chọn phụ kiện kèm theo từ danh mục cố định (Luồng đúng - FR4)
- **1. Mã:** TC-04
- **2. Tiền điều kiện:** Công cụ Postman sẵn sàng gửi request tạo phiếu.
- **3. Các bước:** Gửi request tạo phiếu kèm mảng phụ kiện (`SAC`, `TAI_NGHE`) qua Postman rồi submit.
- **4. Dữ liệu thử:** `accessories: ["SAC", "TAI_NGHE"]`
- **5. Kết quả mong đợi:** Dữ liệu phụ kiện được lưu chính xác vào bảng liên kết `ticket_accessory` tương ứng với mã phiếu.
- **6. Mức ưu tiên:** Trung bình
- **7. Kết quả thực tế:** Bản ghi trong cơ sở dữ liệu và phản hồi API ghi nhận đúng 2 phụ kiện SAC và TAI_NGHE. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-04.png`

### TC-05: Giá trị biên ngày tháng xác định bảo hành QT-05 (Giá trị biên)
- **1. Mã:** TC-05
- **2. Tiền điều kiện:** Thiết bị mua ngày `2026-03-01`, hạn 12 tháng (Hạn chót tính bảo hành là `2027-03-01`).
- **3. Các bước:** Gửi 2 request API kiểm tra tình trạng bảo hành qua Postman tại ngày biên `2027-03-01` và ngày vượt biên `2027-03-02`.
- **4. Dữ liệu thử:** Ngày tiếp nhận 1: `2027-03-01`; Ngày tiếp nhận 2: `2027-03-02`.
- **5. Kết quả mong đợi:** 
  * Ngày `2027-03-01`: Vẫn là `CON_BAO_HANH`.
  * Ngày `2027-03-02`: Chuyển thành `HET_BAO_HANH`.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Phản hồi API đúng logic ranh giới thời gian. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-05.png`

### TC-06: Giá trị biên độ dài mô tả lỗi issue_desc (Giá trị biên)
- **1. Mã:** TC-06
- **2. Tiền điều kiện:** Công cụ Postman sẵn sàng gửi request.
- **3. Các bước:** Gửi request tạo phiếu qua Postman với mô tả đúng 10 ký tự (biên dưới) và 8 ký tự (vi phạm).
- **4. Dữ liệu thử:** Chuỗi 1: `"Lỗi nguồn!"` (10 ký tự); Chuỗi 2: `"Lỗi pin"` (8 ký tự).
- **5. Kết quả mong đợi:** 
  * Chuỗi 1: Thành công (`201 Created`).
  * Chuỗi 2: Từ chối, trả về lỗi `400 Bad Request`.
- **6. Mức ưu tiên:** Trung bình
- **7. Kết quả thực tế:** API xử lý đúng biên độ dài mô tả lỗi. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-06.png`

### TC-07: Gửi yêu cầu với trường bắt buộc bị thiếu (Dữ liệu sai)
- **1. Mã:** TC-07
- **2. Tiền điều kiện:** Hệ thống backend đang hoạt động.
- **3. Các bước:** Gửi request POST thiếu trường bắt buộc `issue_desc` qua Postman.
- **4. Dữ liệu thử:** `{ deviceId: 1, serviceCenterId: 1, receivedBy: 1024 }` (thiếu issueDesc).
- **5. Kết quả mong đợi:** HTTP `400 Bad Request`; thông điệp phản hồi nêu rõ tên trường còn thiếu.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Postman nhận được mã HTTP 400 kèm thông báo lỗi tường minh. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-07.png`

### TC-08: Gửi yêu cầu tra cứu với Serial/IMEI không tồn tại trong CSDL (Dữ liệu sai)
- **1. Mã:** TC-08
- **2. Tiền điều kiện:** Hệ thống đang hoạt động.
- **3. Các bước:** Gửi request GET tra cứu với mã Serial không có thật qua Postman.
- **4. Dữ liệu thử:** `serialNo: "UNKNOWN_SERIAL_999"`
- **5. Kết quả mong đợi:** HTTP `404 Not Found`; thông điệp thông báo không tìm thấy thiết bị.
- **6. Mức ưu tiên:** Trung bình
- **7. Kết quả thực tế:** API trả về HTTP 404 Not Found chính xác. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-08.png`

### TC-09: Kiểm tra phân quyền truy cập chức năng Quản lý trên giao diện (Bảo mật & Phân quyền)
- **1. Mã:** TC-09
- **2. Tiền điều kiện:** Đã đăng nhập bằng tài khoản nhân viên tiếp nhận (`nv1024`) trên giao diện web.
- **3. Các bước:** Thao tác trực tiếp trên giao diện, bấm vào tab Phê duyệt yêu cầu (chức năng giới hạn của Quản lý).
- **4. Dữ liệu thử:** Tài khoản đăng nhập: `nv1024` (Role: `staff`).
- **5. Kết quả mong đợi:** Hệ thống chặn ngay lập tức và hiển thị popup thông báo từ chối truy cập.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Giao diện hiển thị Popup từ chối truy cập: *"Bạn là Nhân viên tiếp nhận, không có quyền truy cập chức năng Phê duyệt yêu cầu (Chỉ dành cho Quản lý)!"*. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-09.png`

### TC-10: Kiểm tra chức năng lọc danh sách phiếu bảo hành trong ngày của tôi (FR9 - Luồng đúng)
- **1. Mã:** TC-10
- **2. Tiền điều kiện:** Giao diện quản lý danh sách phiếu đang mở, có sẵn các phiếu được tạo trong ngày.
- **3. Các bước:** Trên giao diện trang danh sách phiếu, tích chọn hộp kiểm Lọc phiếu trong ngày của tôi (FR9)
- **4. Dữ liệu thử:** Tài khoản đăng nhập: `nv1024` (Role: `staff`).
- **5. Kết quả mong đợi:** Hệ thống lọc và chỉ hiển thị danh sách các phiếu bảo hành được tiếp nhận trong ngày tương ứng với tài khoản đang đăng nhập.
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Giao diện lọc thành công, danh sách hiển thị đúng các phiếu trong ngày. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-10.png`

### TC-11: Kiểm tra quy tắc che số điện thoại khách hàng QT-15 / NFR2 (Chất lượng dữ liệu & Bảo mật)
- **1. Mã:** TC-11
- **2. Tiền điều kiện:** Đã có dữ liệu khách hàng trong hệ thống.
- **3. Các bước:** Mở trang danh sách phiếu bảo hành trực tiếp trên giao diện web hệ thống.
- **4. Dữ liệu thử:** Số điện thoại gốc trong CSDL: `"0763247885"`.
- **5. Kết quả mong đợi:** Giao diện hiển thị số điện thoại ở dạng che 4 số giữa (`076****885`).
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Giao diện hiển thị đúng chuẩn định dạng che số điện thoại QT-15. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-11.png`

### TC-12: Chạy lại migration và script nạp dữ liệu seed lần thứ hai (Tính tái lập)
- **1. Mã:** TC-12
- **2. Tiền điều kiện:** CSDL đã được khởi tạo và nạp dữ liệu mẫu từ trước.
- **3. Các bước:** Mở Terminal trong VS Code, chạy lệnh thực thi script kiểm tra/import dữ liệu (ví dụ: npm test hoặc node import_csv.js) để kiểm tra tính tái lập của hệ thống.
- **4. Dữ liệu thử:** Lệnh kiểm thử và nạp dữ liệu trên môi trường local.
- **5. Kết quả mong đợi:** Quá trình chạy kết thúc thành công, không phát sinh lỗi trùng khóa chính, số lượng bản ghi giữ nguyên (`N = N`).
- **6. Mức ưu tiên:** Cao
- **7. Kết quả thực tế:** Terminal thông báo chạy thành công, dữ liệu không bị nhân đôi. (PASS)
- **8. PASS / FAIL:** PASS — Ảnh chụp: `docs/screenshots/TC-12.png`