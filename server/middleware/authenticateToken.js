const jwt = require('jsonwebtoken');
const { secretKey } = require('../credentials');

function authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Authorization Header: ", authHeader);
    console.log("Extracted Token: ", token);
    
    if (!token || token === 'null') {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = user;
        next();
    });

}

module.exports = authenticateToken;
