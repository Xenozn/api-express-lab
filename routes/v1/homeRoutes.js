const express = require('express');
const router = express.Router();

// Imports
const homeController = require('../../controllers/v1/homeController');
const dateController = require('../../controllers/v1/dateController');
const imageController = require('../../controllers/v1/image.controller');
const upload = require('../../middlewares/uploadMiddleware');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Routes GET
router.get('/', verifyToken, homeController.index);
router.get('/date', verifyToken, dateController.today);

// Route POST pour l'image
router.post('/saveimage', verifyToken, upload.single('image'), imageController.saveImage);

module.exports = router;