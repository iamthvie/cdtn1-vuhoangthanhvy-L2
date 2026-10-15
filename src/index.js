// src/index.js
const express = require('express');
const app = express();
const ticketRoutes = require('./routes/ticket.routes');

app.use(express.json());
app.use('/api', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server CRM Luong L2 dang chay tai: http://localhost:${PORT}`);
});