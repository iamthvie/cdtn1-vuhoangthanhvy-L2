# BẢN SRS RÚT GỌN — LUỒNG L2: TIẾP NHẬN YÊU CẦU BẢO HÀNH

**Sinh viên:** Vũ Hoàng Thanh Vy — **MSSV:** 2374802010580 — **Track:** SE  
**Học phần:** Chuyên đề Tốt nghiệp 1, HK1 2026–2027  
**Luồng nghiệp vụ:** L2 – Tiếp nhận và phân loại yêu cầu bảo hành (phạm vi con đã phê duyệt)

---

## 1. Giới thiệu và phạm vi

### 1.1. Bối cảnh
Mekong Mobile (24 cửa hàng, 6 trung tâm bảo hành, ~260 yêu cầu bảo hành/tháng) hiện ghi yêu cầu bảo hành trên phiếu giấy. Khi không tra được ngày mua, nhân viên tiếp nhận thường ghi “còn bảo hành” để không mất khách, gây tranh chấp về sau. Lịch sử sửa chữa của một máy không tra được, nên không phát hiện máy sửa lặp lại.

### 1.2. Phạm vi
Nhân viên tiếp nhận tra cứu lịch sử sửa chữa trước đó của thiết bị bằng số serial/IMEI, xác thực tình trạng bảo hành (có sự phê duyệt của quản lý nếu mất hóa đơn/hết hạn), và ghi nhận chi tiết phụ kiện kèm theo cùng mô tả lỗi của khách.

**CHỦ Ý KHÔNG LÀM (WON’T):**
* Tạo hồ sơ khách hàng mới và tra cứu khách theo số điện thoại (thuộc L1).
* Đăng ký thiết bị mới chưa có trong hệ thống.
* Phân loại nhóm sự cố, đề xuất mức ưu tiên, sinh hạn cam kết (QT-04).
* Gán kỹ thuật viên, đặt lịch hẹn, theo dõi tiến độ sửa chữa, báo cáo phiếu quá hạn.
* Gửi thông báo (SMS/Zalo) cho khách; đính kèm ảnh.

### 1.3. Bảng thuật ngữ

| Thuật ngữ | Định nghĩa |
| :--- | :--- |
| **Nhân viên tiếp nhận** | Nhân viên trung tâm bảo hành thực hiện tiếp nhận yêu cầu. |
| **Quản lý trung tâm** | Người phê duyệt các trường hợp bảo hành cần xét. |
| **Thiết bị** | Một máy cụ thể của khách, xác định duy nhất bằng số serial hoặc IMEI (device). |
| **Phiếu bảo hành** | Yêu cầu bảo hành/sửa chữa được ghi nhận, có mã duy nhất (ticket), ví dụ BH000123/2026. |
| **Trạng thái phiếu** | Vị trí của phiếu trong vòng đời: Mới -> Đã phân công -> Đang xử lý -> Chờ linh kiện -> Hoàn tất -> Đã đóng (hoặc Đã hủy). |
| **Ngày mua** | Ngày khách mua thiết bị (purchase_date). |
| **Số tháng bảo hành** | Thời hạn bảo hành theo sản phẩm (warranty_months, mặc định 12). |
| **Tình trạng bảo hành** | Một trong ba giá trị: Còn bảo hành, Hết bảo hành, Chưa xác minh bảo hành. |
| **Yêu cầu phê duyệt** | Đề nghị gửi quản lý trung tâm quyết định đối với phiếu “Chưa xác minh bảo hành” hoặc máy “Hết bảo hành” cần xét ngoại lệ. |
| **Phụ kiện kèm theo** | Món đi kèm máy khi giao: Sạc, Tai nghe, Hộp, Khác. |

---

## 2. Các bên liên quan và vai trò người dùng

| Vai trò | Được làm | Không được làm |
| :--- | :--- | :--- |
| **Nhân viên tiếp nhận** | Tra cứu thiết bị và lịch sử; xem tình trạng bảo hành; chọn phụ kiện; ghi mô tả lỗi; lưu phiếu; gửi yêu cầu phê duyệt; xem phiếu do mình tiếp nhận trong ca. | Tự ghi “Còn bảo hành” khi chưa xác minh; phê duyệt yêu cầu của chính mình; xóa phiếu (QT-13); xem dữ liệu của trung tâm khác (QT-14). |
| **Quản lý trung tâm** | Xem danh sách phiếu chờ phê duyệt; phê duyệt hoặc từ chối kèm lý do; xem số điện thoại đầy đủ (QT-15). | Xóa phiếu (QT-13); xem dữ liệu của trung tâm khác. |

---

## 3. Yêu cầu chức năng và User Story

### 3.1. Danh sách yêu cầu chức năng (FR)
* **FR1:** Hệ thống cho phép nhân viên tiếp nhận nhập số serial/IMEI và trả về thông tin thiết bị, tên chủ sở hữu (số điện thoại dạng che) và danh sách các phiếu bảo hành trước đó của thiết bị.
* **FR2:** Hệ thống tự xác định tình trạng bảo hành theo QT-05: “Còn bảo hành” nếu (ngày tiếp nhận − ngày mua) <= số tháng bảo hành; “Hết bảo hành” nếu vượt; “Chưa xác minh bảo hành” nếu thiết bị không có ngày mua.
* **FR3:** Hệ thống cho phép nhân viên tiếp nhận ghi mô tả lỗi (bắt buộc) và lưu phiếu bảo hành mới ở trạng thái Mới, có mã phiếu duy nhất, ghi nhận người tiếp nhận và thời điểm tiếp nhận.
* **FR4:** Hệ thống cho phép chọn phụ kiện kèm theo từ danh mục cố định (Sạc, Tai nghe, Hộp, Khác); khi chọn “Khác” bắt buộc nhập ghi chú.
* **FR5:** Hệ thống cho phép nhân viên tiếp nhận gửi yêu cầu phê duyệt kèm lý do tới quản lý trung tâm cho phiếu “Chưa xác minh bảo hành” hoặc “Hết bảo hành” cần xét ngoại lệ.
* **FR6:** Hệ thống hiển thị cho quản lý trung tâm danh sách yêu cầu phê duyệt đang chờ của trung tâm mình, sắp theo thời điểm gửi (cũ nhất trước).
* **FR7:** Hệ thống cho phép quản lý trung tâm phê duyệt hoặc từ chối yêu cầu; từ chối bắt buộc có lý do; quyết định được ghi lại cùng người quyết định và thời điểm.
* **FR8:** Hệ thống hiển thị cảnh báo khi thiết bị đã có từ 2 phiếu bảo hành trước (lần tiếp nhận hiện tại là lần thứ 3 trở lên).
* **FR9:** Hệ thống hiển thị cho nhân viên tiếp nhận danh sách phiếu do chính mình tiếp nhận trong ngày hiện tại.

### 3.2. User Story và mức MoSCoW
* **US1 (MUST):** Là nhân viên tiếp nhận, tôi muốn nhập số serial/IMEI để xem thông tin thiết bị và danh sách phiếu bảo hành trước đó, để không phải hỏi lại khách hay gọi cửa hàng và lật sổ tìm lịch sử.
* **US2 (MUST):** Là nhân viên tiếp nhận, tôi muốn hệ thống tự cho biết thiết bị còn hay hết bảo hành dựa vào ngày mua và số tháng bảo hành, để không phải tự đoán và không ghi "còn bảo hành" khi chưa tra được ngày mua.
* **US7 (MUST):** Là nhân viên tiếp nhận, tôi muốn ghi mô tả lỗi theo lời khách và lưu thành phiếu bảo hành mới, để yêu cầu được theo dõi trong hệ thống thay vì phiếu giấy.
* **US3 (SHOULD):** Là nhân viên tiếp nhận, tôi muốn gửi yêu cầu phê duyệt kèm lý do tới quản lý trung tâm khi phiếu chưa xác minh bảo hành hoặc máy hết bảo hành cần xét ngoại lệ, và được cảnh báo sửa lặp lại khi thiết bị đã có từ 2 phiếu trước, để không tự quyết định thay quản lý và không tiếp tục sửa lần thứ ba mà chưa báo quản lý.
* **US4 (SHOULD):** Là nhân viên tiếp nhận, tôi muốn chọn phụ kiện kèm theo từ danh mục thay vì gõ tay, để dữ liệu thống nhất và có căn cứ đối chiếu khi trả máy.
* **US5 (SHOULD):** Là quản lý trung tâm, tôi muốn xem danh sách yêu cầu phê duyệt đang chờ theo thứ tự thời điểm gửi và phê duyệt hoặc từ chối từng yêu cầu kèm lý do, để xử lý kịp, khách không phải chờ lâu và quyết định được ghi lại, tránh tranh chấp.
* **US6 (COULD):** Là nhân viên tiếp nhận, tôi muốn xem danh sách phiếu bảo hành do mình tiếp nhận trong ngày, để đối chiếu cuối ngày thay vì chép lại sang Excel (khoảng 40 phút mỗi ngày).

---

## 4. Yêu cầu phi chức năng (NFR)

| Mã | Loại | Yêu cầu (có ngưỡng đo được) | Cách kiểm chứng |
| :--- | :--- | :--- | :--- |
| **NFR1** | Hiệu năng | Tra cứu thiết bị theo serial (FR1) trả kết quả trong dưới 2 giây ở ít nhất 95% trong 50 lần gọi liên tiếp, với CSDL chứa 7.800 phiếu bảo hành, trên máy 8 GB RAM. | Gọi API 50 lần, đo thời gian phản hồi, lưu bảng kết quả. |
| **NFR2** | Bảo mật | 100% phản hồi gửi cho vai trò Nhân viên tiếp nhận hiển thị số điện thoại dạng che (ví dụ `090****567`); chỉ Quản lý trung tâm thấy đầy đủ (QT-15). Nhân viên chỉ truy cập dữ liệu của trung tâm mình (QT-14). | Gọi API bằng hai vai trò, đối chiếu phản hồi. |
| **NFR3** | Khả dụng | Nhân viên tiếp nhận mới, không được hướng dẫn, tạo được 1 phiếu hoàn chỉnh trong dưới 3 phút với tối đa 6 thao tác nhập. | Thử với 1 người chưa dùng hệ thống, bấm giờ. |
| **NFR4** | Tin cậy | Lưu phiếu theo giao dịch (transaction); khi mất kết nối giữa lúc lưu, số phiếu được tạo là đúng 1 (không 0, không 2) trong 10/10 lần thử. | Ngắt kết nối khi lưu, lặp 10 lần, đếm số phiếu. |

---

## 5. Ràng buộc và quy tắc nghiệp vụ

* **QT-03:** Thiết bị xác định duy nhất bằng serial hoặc IMEI; một thiết bị chỉ thuộc một khách hàng tại một thời điểm.
* **QT-05:** Còn bảo hành nếu (ngày tiếp nhận − ngày mua) <= số tháng bảo hành. Không có ngày mua thì phiếu đánh dấu “chưa xác minh bảo hành” và cần quản lý phê duyệt.
* **QT-06:** Mọi lần chuyển trạng thái phiếu phải ghi vào `ticket_status_log`; phiếu mới ở trạng thái Mới.
* **QT-13:** Không xóa vật lý phiếu, chỉ đánh dấu ngừng sử dụng (soft delete).
* **QT-14:** Nhân viên chỉ xem dữ liệu của trung tâm mình; quản lý xem toàn đơn vị mình phụ trách.
* **QT-15:** Số điện thoại hiển thị dạng che với mọi vai trò trừ Quản lý và Ban giám đốc.
* **BR-A1:** (Giả định) Phê duyệt là thông tin riêng của phiếu (trạng thái phê duyệt), không thêm trạng thái mới vào vòng đời phiếu ở Hình 6.2, để giữ đúng QT-06.
* **BR-A2:** (Giả định) Cảnh báo sửa lặp lại khi thiết bị có từ 2 phiếu trước (không tính phiếu Đã hủy).
* **BR-A3:** (Giả định) Phiếu hết bảo hành mặc định có tính phí; chỉ chuyển thành miễn phí khi quản lý phê duyệt ngoại lệ.
* **BR-A4:** (Giả định) Vì phân loại/ưu tiên/hạn cam kết nằm ngoài phạm vi, phiếu tạo ra có mức ưu tiên mặc định TRUNG_BINH và để trống hạn cam kết cho luồng phân loại xử lý sau.

---

## 6. Bảng truy vết yêu cầu

| Mã FR | Yêu cầu chức năng (tóm tắt) | User Story | Use Case | MoSCoW |
| :--- | :--- | :--- | :--- | :--- |
| **FR1** | Tra cứu thiết bị và lịch sử theo serial/IMEI | US1 | UC1 | MUST |
| **FR2** | Xác định tình trạng bảo hành (QT-05) | US2 | UC2 | MUST |
| **FR3** | Ghi mô tả lỗi và lưu phiếu trạng thái Mới | US7 | UC4 | MUST |
| **FR4** | Chọn phụ kiện kèm theo từ danh mục | US4 | UC3 | SHOULD |
| **FR5** | Gửi yêu cầu phê duyệt kèm lý do | US3 | UC5 | SHOULD |
| **FR6** | Danh sách yêu cầu chờ phê duyệt cho quản lý | US5 | UC6 | SHOULD |
| **FR7** | Phê duyệt hoặc từ chối kèm lý do | US5 | UC7 | SHOULD |
| **FR8** | Cảnh báo thiết bị có từ 2 phiếu trước | US3 | UC1 | SHOULD |
| **FR9** | Danh sách phiếu đã tiếp nhận trong ngày | US6 | UC8 | COULD |