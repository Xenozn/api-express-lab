require('dotenv').config();
const express = require('express');
const app = express();

const apiVersion = process.env.API_VERSION || 'v1';
const port = process.env.PORT || 3000;

// routes dynamiques
const homeRoutes = require(`./routes/${apiVersion}/homeRoutes`);
app.use(`/${apiVersion}`, homeRoutes);

// serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}/${apiVersion}`);
});
