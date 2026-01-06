exports.index = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API Express MVC OK'
    });
};
