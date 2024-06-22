const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.schema');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 8);
  await user.save();
  const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
  res.status(201).send({ user, token });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send('Invalid login credentials');
  }
  const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
  res.send({ user, token });
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
