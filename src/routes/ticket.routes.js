// src/routes/ticket.routes.js
const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticket.service');
const { validateCreateTicket } = require('../validators/ticket.schema');

// GET /api/tickets - Trả về dữ liệu + Xử lý trạng thái RỖNG ([])
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(200).json({
      status: 'success',
      total: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      error: 'LOI_HE_THONG',
      message: 'Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại.',
      details: error.message
    });
  }
});

// POST /api/tickets - Kiểm tra ranh giới bằng Validator
router.post('/tickets', async (req, res) => {
  try {
    const validation = validateCreateTicket(req.body);
    if (!validation.isValid) {
      return res.status(422).json({
        error: 'DU_LIEU_KHONG_HOP_LE',
        message: 'Dữ liệu đầu vào không hợp lệ',
        fields: validation.errors
      });
    }

    const newTicket = await ticketService.createTicket(req.body);
    res.status(201).json({
      status: 'success',
      data: newTicket
    });
  } catch (error) {
    res.status(500).json({
      error: 'LOI_HE_THONG',
      message: 'Hệ thống đang gặp sự cố khi lưu phiếu',
      details: error.message
    });
  }
});

module.exports = router;