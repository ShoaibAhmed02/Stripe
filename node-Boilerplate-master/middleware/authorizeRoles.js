const jwt = require('jsonwebtoken');
const  User   = require('../models/User');
exports. authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next( res.status(400).send({
                status: 0,
                message: `Role ${req.user.role} is not allowed to access this resource`
            }));
        }
        next();
    }
}