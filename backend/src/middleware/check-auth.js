const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userData = { id: decoded.id, email: decoded.email };
    } catch (err) {
        const error = new HttpError("Not authenticated!", 401);
        return next(error)
    }
    next();
}