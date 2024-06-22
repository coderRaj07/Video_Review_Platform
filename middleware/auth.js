const jwt = require('jsonwebtoken');
const User = require('../models/User.schema');
const { Types } = require("mongoose")
const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, 'your_jwt_secret');

  const userId = Types.ObjectId.createFromHexString(decoded._id);
  const user = await User.findOne({ _id: userId });
  console.log("user is", user)
  if (!user) {
    throw new Error();
  }
  req.user = user;
  next();
};
module.exports = auth;
