const jwt = require('jsonwebtoken');

const isTokenValid = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = process.env.SECRET;

  if (!token) {
    return res.status(401).json({
      message: 'missing auth token',
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    req.email = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'jwt malformed',
    });
  }
};

module.exports = {
  isTokenValid,
};