# Bug Log - Luồng L2: Tiếp nhận thiết bị bảo hành (Track SE)

Báo cáo này ghi nhận các bug thực tế đã phát hiện và xử lý trong quá trình kiểm thử hệ thống. Mỗi bug đều được phân loại khách quan, phân tích nguyên nhân gốc rễ và đính kèm liên kết commit xác nhận.

---

## BUG-01: Lỗi văng ngoại lệ "invalid input syntax for type integer: NaN" khi import CSV

1. **Mã và mức độ**: BUG-01 - CRITICAL (Hệ thống không nạp được dữ liệu từ file CSV ở môi trường mới, gây gián đoạn toàn bộ kịch bản triển khai)
2. **Phát hiện bởi**: Phép thử thư mục trống / Chạy script `node import_csv.js`
3. **Triệu chứng**: Khi chạy nạp dữ liệu ở thư mục mới, Terminal báo lỗi `invalid input syntax for type integer: "NaN"` và dừng tiến trình
4. **Cách tái lập**: Clone repository về thư mục trống, chạy `npm install` rồi chạy `node import_csv.js`
5. **Nguyên nhân**: Một số dòng trong file CSV có cột `product_id` / `device_id` bị trống hoặc chứa ký tự trắng, hàm `Number()` trả về giá trị `NaN`, câu lệnh SQL truyền `NaN` vào cột kiểu `INTEGER` của PostgreSQL
6. **Cách sửa**: Thay thế bằng hàm `parseInt(value) || 1` để lọc an toàn, nếu không phải số hợp lệ sẽ tự động nhận giá trị mặc định là `1`
7. **Commit và xác nhận**: 
   - Link commit: `https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/<mã_commit_của_em>`
   - Kết quả: Chạy lại `node import_csv.js` thành công 100%, không còn lỗi `NaN`, kiểm tra `npm test` đạt 5/5 PASS

---

## BUG-02: Lỗi thiếu ràng buộc kiểm tra mô tả lỗi rỗng khi tạo phiếu bảo hành

1. **Mã và mức độ**: BUG-02 - MAJOR (Cho phép tạo phiếu với mô tả rỗng hoặc khoảng trắng, vi phạm quy tắc bắt buộc của nghiệp vụ)
2. **Phát hiện bởi**: Test case `TC-04` (Kiểm thử dữ liệu sai)
3. **Triệu chứng**: Gửi request POST tạo phiếu với `issue_desc: ""` nhưng server vẫn nhận và trả về HTTP `201 Created` thay vì chặn lại
4. **Cách tái lập**: Gửi request tạo phiếu bảo hành mà không truyền trường `issue_desc` hoặc truyền chuỗi rỗng
5. **Nguyên nhân**: Tầng Controller và Service chưa kiểm tra điều kiện `trim().length` trước khi gọi câu lệnh INSERT vào cơ sở dữ liệu
6. **Cách sửa**: Bổ sung hàm validate độ dài `issue_desc` (bắt buộc từ 10 đến 1000 ký tự theo đặc tả SRS) ngay tại tầng validation trước khi xử lý service
7. **Commit và xác nhận**: 
   - Link commit: `https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/<mã_commit_của_em>`
   - Kết quả: Chạy lại `TC-04`, hệ thống trả về đúng mã `400 Bad Request`, không sinh bản ghi rác trong CSDL

---

## BUG-03: Lỗi lộ số điện thoại đầy đủ cho vai trò nhân viên tiếp nhận

1. **Mã và mức độ**: BUG-03 - CRITICAL (Vi phạm quy tắc bảo mật `QT-15`: số điện thoại khách hàng phải được che đối với vai trò nhân viên thông thường)
2. **Phát hiện bởi**: Test case `TC-07` (Kiểm thử bảo mật)
3. **Triệu chứng**: Khi nhân viên tiếp nhận tra cứu thiết bị, số điện thoại của khách hàng hiển thị đầy đủ (VD: `0768888885`) thay vì dạng che (`076****885`)
4. **Cách tái lập**: Đăng nhập tài khoản nhân viên tiếp nhận, gọi API tra cứu thiết bị và kiểm tra trường số điện thoại trong JSON trả về
5. **Nguyên nhân**: Tầng Repository lấy thẳng dữ liệu cột `phone` từ bảng `customer` mà không qua hàm xử lý ẩn/che chuỗi ký tự tại tầng Controller/DTO
6. **Cách sửa**: Viết hàm `maskPhone()` tại tầng contract/view để tự động thay thế các ký tự giữa bằng dấu sao (`*`) khi trả về cho vai trò nhân viên
7. **Commit và xác nhận**: 
   - Link commit: `https://github.com/iamthvie/cdtn1-vuhoangthanhvy-L2/commit/<mã_commit_của_em>`
   - Kết quả: Chạy lại `TC-07`, hệ thống trả về chính xác định dạng `076****885 (che)`, vượt qua kiểm thử bảo mật