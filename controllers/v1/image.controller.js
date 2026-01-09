exports.saveImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucune image envoyée' });
    }

    res.status(201).json({
        message: 'Image enregistrée',
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
};
