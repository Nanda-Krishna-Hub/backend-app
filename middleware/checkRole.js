

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("User role:", req.user?.role);
        console.log("Allowed roles:", allowedRoles)
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message: "Access denined insufficient role"});
        }
        next();
    }
}


module.exports = checkRole;