const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1];
    // if(!token) return res.status(401).json({message: "Token not found"});
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"})
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, 'secret123');
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message: "Invalid token or Token expired"});
    }
}

module.exports = auth;