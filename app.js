require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// --- Logging ---
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logStream = fs.createWriteStream(path.join(logDir, 'api.log'), { flags: 'a' });
app.use(morgan(':date[iso] :remote-addr :method :url :status', { stream: logStream }));

app.use(express.json());

// --- Rate Limit ---
const limiter = rateLimit({
    windowMs: Number(process.env.LIMIT_TIME) || 60 * 60 * 1000, // 1h
    max: Number(process.env.LIMIT_PER_HOUR) || 100,
    message: { status: 'error', message: 'Trop de requêtes, réessayez dans 1 heure' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(`/${apiVersion}`, limiter);

// --- JWT Middleware ---
const authMiddleware = require('./middlewares/authMiddleware');

// --- Routes ---
const authRoutes = require(`./routes/${apiVersion}/authRoutes`);
app.use(`/${apiVersion}/auth`, authRoutes);

const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);
app.use(`/${apiVersion}`, authMiddleware.verifyToken, homeRoutes);

// --- Swagger Setup ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API MVC Express JWT',
            version: '1.0.0',
            description: 'API avec register/login JWT, route protégée /date, rate-limit et logging'
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
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/**/*.js'], // swagger doc dans les routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Serveur ---
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}/${apiVersion}`);
    console.log(`Swagger UI disponible sur http://localhost:${port}/api-docs`);
});
