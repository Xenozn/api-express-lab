const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Log pour voir si le header arrive bien
    console.log("--- Tentative de vérification ---");
    console.log("Auth Header reçu:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Log de la clé secrète utilisée (attention : ne pas faire en prod !)
        const secret = process.env.JWT_SECRET || 'secret123';

        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        console.log("Token valide pour l'utilisateur:", decoded.username || decoded.id);
        next();
    } catch (err) {
        // C'EST ICI QUE TU SAURAS POURQUOI CA RATE
        console.error("ERREUR JWT:", err.message);

        if (err.message === "jwt expired") {
            console.log("Le token a expiré à:", err.expiredAt);
        }

        return res.status(401).json({ status: 'error', message: 'Token invalide ou expiré' });
    }
};