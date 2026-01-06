const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

router.get('/sync', syncController.runSync);

router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

module.exports = router;