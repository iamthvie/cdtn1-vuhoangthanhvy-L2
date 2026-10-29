const express = require('express');
const path = require('path');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware đọc JSON
app.use(express.json());

// Phục vụ giao diện web tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// Đăng ký routes API
app.use('/api', ticketRoutes);

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server CRM Luong L2 dang chay tai: http://localhost:${PORT}`);
});