const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/v1/homeController');
const dateController = require('../../controllers/v1/dateController');


/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     description: Retourne un message de bienvenue ou un statut simple.
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès - message de bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Bienvenue sur l'API"
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Token invalide ou manquant"
 */
router.get('/', homeController.index);

/**
 * @swagger
 * /date:
 *   get:
 *     summary: Get today's date (protected)
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Date actuelle
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/date', dateController.today);

module.exports = router;
