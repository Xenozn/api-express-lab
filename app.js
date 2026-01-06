require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// Créer le dossier logs si besoin
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Logger vers un fichier
const logFilePath = path.join(logDir, 'api.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// ✅ Middleware morgan pour logger toutes les requêtes
app.use(morgan(':date[iso] :remote-addr :method :url :status', {
    stream: logStream,
}));

// Pour tester, parser JSON (utile si tu veux logger body plus tard)
app.use(express.json());

// Routes dynamiques
const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);
app.use(`/${apiVersion}`, homeRoutes);

// Serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}/${apiVersion}`);
});
