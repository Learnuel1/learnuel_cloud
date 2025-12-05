exports.register = (req, res, next) => {
    const { email, password, firstName, lastName, phone} = req.body;
    if(!email) 
    res.status(200).json({ message: "User registration endpoint" });
}