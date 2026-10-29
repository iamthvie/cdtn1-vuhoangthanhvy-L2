-- 1. Nạp khách hàng mẫu
INSERT INTO customer (full_name, phone) VALUES
('Nguyễn Văn An', '0901234567'),
('Trần Thị Bình', '0918765432'),
('Lê Hoàng Nam', '0933456789'),
('Phạm Minh Châu', '0978123456'),
('Vũ Quốc Anh', '0909888777')
ON CONFLICT DO NOTHING;

-- 2. Nạp thiết bị mẫu
INSERT INTO device (customer_id, serial_no, model_name, purchase_date, warranty_months) VALUES
(1, '356938035643809', 'Galaxy A15', '2026-02-14', 12),
(2, '356938035640001', 'iPhone 13', NULL, 12),
(3, '356938035640002', 'Xiaomi 13T', '2025-11-20', 18),
(4, '356938035640003', 'OPPO Reno10', '2026-01-10', 12),
(5, '356938035640004', 'iPad Air 5', '2024-05-15', 12)
ON CONFLICT (serial_no) DO NOTHING;

-- 3. Nạp danh sách phiếu bảo hành mẫu (Đã rút ngắn chuỗi warranty_status về dưới 20 ký tự)
INSERT INTO ticket (ticket_code, device_id, issue_desc, warranty_status, status, received_at) VALUES
('BH000123/2026', 1, 'Màn hình chớp nháy liên tục khi sử dụng', 'CON_BAO_HANH', 'MOI', NOW() - INTERVAL '3 days'),
('BH000124/2026', 2, 'Máy không xác định ngày mua, mất nguồn đột ngột', 'CHUA_XAC_MINH', 'MOI', NOW() - INTERVAL '2 days'),
('BH000125/2026', 3, 'Camera sau bị mờ, không lấy nét tự động được', 'CON_BAO_HANH', 'DANG_XU_LY', NOW() - INTERVAL '1 day'),
('BH000126/2026', 4, 'Loa ngoài bị rè và mất tiếng khi nghe gọi', 'CON_BAO_HANH', 'MOI', NOW()),
('BH000127/2026', 5, 'Pin phồng nhẹ, máy sạc rất chậm và hay tự ngắt', 'HET_BAO_HANH', 'HOAN_THANH', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;