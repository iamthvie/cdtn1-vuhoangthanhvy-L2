// src/routes/ticket.routes.js
const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticket.service');

// 1. API Lấy danh sách phiếu
router.get('/tickets', async (req, res, next) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json({ data: tickets });
  } catch (err) {
    next(err);
  }
});

// 1.1 API Tra cứu thiết bị động theo Serial/IMEI
router.get('/devices/search', async (req, res, next) => {
  try {
    const { serial } = req.query;
    if (!serial) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp số Serial hoặc IMEI' });
    }
    const result = await ticketService.searchDeviceBySerial(serial);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// 2. API Tạo phiếu bảo hành mới
router.post('/tickets', async (req, res, next) => {
  try {
    const deviceId = req.body.deviceId || req.body.device_id;
    const issueDesc = req.body.issueDesc || req.body.issue_desc;

    if (!issueDesc || issueDesc.trim().length < 10) {
      return res.status(400).json({ error: 'Mô tả sự cố phải từ 10 ký tự trở lên' });
    }

    if (!deviceId) {
      return res.status(400).json({ error: 'Vui lòng nhập Mã Thiết Bị (Device ID)' });
    }

    const created = await ticketService.createTicket({
      device_id: Number(deviceId),
      issue_desc: issueDesc.trim(),
      ticket_code: `BH${Math.floor(100000 + Math.random() * 900000)}/2026`
    });

    res.status(201).json({ data: created });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Lỗi hệ thống khi tạo phiếu' });
  }
});

module.exports = router;