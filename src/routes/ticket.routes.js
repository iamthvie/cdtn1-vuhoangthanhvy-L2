// src/routes/ticket.routes.js
const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticket.service');

// GET /api/tickets - Lấy danh sách phiếu bảo hành
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json({
      status: 'success',
      data: tickets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tickets - Tạo phiếu bảo hành mới
router.post('/tickets', async (req, res) => {
  try {
    const newTicket = await ticketService.createTicket(req.body);
    res.status(201).json({
      status: 'success',
      data: newTicket
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;