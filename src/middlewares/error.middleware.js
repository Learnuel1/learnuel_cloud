exports.errorHandler = (err, _req, res, _next) => {
    res.status( err.stats || 500).json({ message: err.message });
}
 