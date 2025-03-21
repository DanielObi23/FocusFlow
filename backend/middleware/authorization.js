import jwt from "jsonwebtoken"

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"] // Bearer TOKEN
    const token = authHeader && authHeader.split(" ")[1]; // want just the token
    if (!token) return res.status(401).json({ message: "No token provided." })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: err.message })
            req.user = user;
            next();
    })
}

export default authenticateToken;
