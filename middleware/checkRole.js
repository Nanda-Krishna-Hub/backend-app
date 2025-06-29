const appError = require('../utils/AppError')

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("User role:", req.user?.role);
        console.log("Allowed roles:", allowedRoles)
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return next(new appError("Access denined. Insufficient permission for role.", 403))
        }
        next();
    }
}


module.exports = checkRole;