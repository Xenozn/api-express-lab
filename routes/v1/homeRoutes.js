const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/v1/homeController');
const dateController = require('../../controllers/v1/dateController');

router.get('/', homeController.index);
router.get('/date', dateController.today);

module.exports = router;
