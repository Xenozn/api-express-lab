require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors'); // Installé via: npm install cors

const app = express();
const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// --- Dossiers de stockage ---
const logDir = path.join(__dirname, 'logs');
const uploadDir = path.join(__dirname, 'images');

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// --- Middlewares Globaux ---
app.use(cors()); // Autorise les requêtes provenant de votre fichier HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre le dossier images accessible publiquement
// Exemple: http://localhost:3000/images/nom-image.jpg
app.use('/images', express.static(uploadDir));

// --- Logging ---
const logStream = fs.createWriteStream(path.join(logDir, 'api.log'), { flags: 'a' });
app.use(morgan(':date[iso] :remote-addr :method :url :status', { stream: logStream }));

// --- Rate Limit ---
const limiter = rateLimit({
    windowMs: Number(process.env.LIMIT_TIME) || 60 * 60 * 1000,
    max: Number(process.env.LIMIT_PER_HOUR) || 100,
    message: { status: 'error', message: 'Trop de requêtes, réessayez dans 1 heure' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(`/${apiVersion}`, limiter);

// --- Routes ---
const authRoutes = require(`./routes/${apiVersion}/authRoutes`);
const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);

// Routes Publiques (Auth)
app.use(`/${apiVersion}/auth`, authRoutes);

// Routes Protégées
// Note : verifyToken est maintenant géré directement à l'intérieur de homeRoutes.js
// pour permettre l'insertion de Multer sur des routes spécifiques.
app.use(`/${apiVersion}`, homeRoutes);

// --- Swagger Setup ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API MVC Express JWT',
            version: '1.0.0',
            description: 'API avec upload d\'images, JWT et Swagger'
        },
        servers: [{ url: `http://localhost:${port}/${apiVersion}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
    },
    apis: [`./routes/${apiVersion}/*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Serveur ---
app.listen(port, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${port}/${apiVersion}`);
    console.log(`📂 Dossier images : http://localhost:${port}/images`);
    console.log(`📖 Swagger UI : http://localhost:${port}/api-docs`);
});