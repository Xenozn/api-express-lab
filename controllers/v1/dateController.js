exports.today = (req, res) => {
    const today = new Date().toISOString().split('T')[0];

    res.status(200).json({
        status: 'success',
        date: today
    });
};
