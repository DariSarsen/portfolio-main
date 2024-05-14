function authenticateToken(req, res, next) {
    const token = req.session.token || req.headers['authorization'];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    if (!isValidToken(token)) {
      return res.sendStatus(403);
    }
  
    next();
  }
  
  module.exports = authenticateToken;
  