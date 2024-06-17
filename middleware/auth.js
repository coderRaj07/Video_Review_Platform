const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, 'your_jwt_secret');
  const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  if (!user) {
    throw new Error();
  }
  req.user = user;
  next();
};
module.exports = auth;
