require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// Crée le dossier logs si nécessaire
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Logger toutes les requêtes dans un fichier
const logStream = fs.createWriteStream(path.join(logDir, 'api.log'), { flags: 'a' });
app.use(morgan(':date[iso] :remote-addr :method :url :status', { stream: logStream }));

app.use(express.json());

const limiter = rateLimit({
    windowMs: Number(process.env.LIMIT_TIME) || 60 * 60 * 1000,
    max: Number(process.env.LIMIT_PER_HOUR) || 100,
    message: { status: 'error', message: 'Trop de requêtes, réessayez dans 1 heure' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(`/${apiVersion}`, limiter);

const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);
app.use(`/${apiVersion}`, homeRoutes);

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}/${apiVersion}`);
});
