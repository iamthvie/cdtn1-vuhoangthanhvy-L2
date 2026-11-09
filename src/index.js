const express = require('express');
const path = require('path');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware đọc JSON
app.use(express.json());

// 1. Đặt định tuyến trang chủ '/' lên trước để ưu tiên trả về login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// 2. Sau đó mới đến middleware phục vụ toàn bộ thư mục public (cho các file css, js, index.html, approval.html khác)
app.use(express.static(path.join(__dirname, '../public')));

// Đăng ký routes API
app.use('/api', ticketRoutes);

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server CRM Luong L2 dang chay tai: http://localhost:${PORT}`);
});