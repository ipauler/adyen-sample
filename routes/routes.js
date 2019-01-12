const path = require('path');

const express = require('express');

const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getPayment);
router.get('/payment', paymentController.getPayment);
router.post('/payment', paymentController.processPayment);
router.get('/details', paymentController.getSubscription);
router.get('/stop', paymentController.getStopSubscription);
router.post('/stop', paymentController.processStopSubscription);

module.exports = router;
