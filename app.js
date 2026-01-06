const express = require('express');
const app = express();

// routes
const homeRoutes = require('./routes/v1/homeRoutes');
app.use('/v1', homeRoutes);

// serveur
app.listen(3000, () => {
    console.log('Serveur lancé sur http://localhost:3000');
});
