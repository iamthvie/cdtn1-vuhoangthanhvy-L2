// src/index.js
const express = require('express');
const path = require('path');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Phục vụ giao diện Frontend tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', ticketRoutes);

app.listen(PORT, () => {
  console.log(`Server CRM Luong L2 dang chay tai: http://localhost:${PORT}`);
});