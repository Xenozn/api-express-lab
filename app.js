require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logStream = fs.createWriteStream(path.join(logDir, 'api.log'), { flags: 'a' });
app.use(morgan(':date[iso] :remote-addr :method :url :status', { stream: logStream }));

app.use(express.json());

// Rate-limit
const limiter = rateLimit({
    windowMs: Number(process.env.LIMIT_TIME) || 60 * 60 * 1000,
    max: Number(process.env.LIMIT_PER_HOUR) || 100,
    message: { status: 'error', message: 'Trop de requêtes, réessayez dans 1 heure' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(`/${apiVersion}`, limiter);

// JWT middleware
const authMiddleware = require('./middlewares/authMiddleware');

// Routes Auth publiques
const authRoutes = require(`./routes/${apiVersion}/authRoutes`);
app.use(`/${apiVersion}/auth`, authRoutes);

// Routes protégées par JWT
const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);
app.use(`/${apiVersion}`, authMiddleware.verifyToken, homeRoutes);

// serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}/${apiVersion}`);
});
