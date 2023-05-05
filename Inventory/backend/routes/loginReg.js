const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const userConn = process.env.USERDB;


const loginToken = process.env.TOKEN;

// schema
const schema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

mongoose.connect(userConn);

const User = mongoose.model('User', schema);

router.post('/login', async (req, res) => {
  try {

    const { user, password } = req.body;
    console.log(user, password)
    const exists = User.findOne({
      username: user});

    if (exists && await bcrypt.compare(password, exists.password)) {
      const token = jwt.sign({ user }, loginToken);
      res.json({token})
    }
    else {
      return res.status(400).json({ error: 'User does not exist. Please register.' });
    }

  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/register/:username', async (req, res) => {
  try{
    const user = req.params.username;
    const { username, password } = req.body;
    const exists = await User.findOne({username: user});
    
    if (exists) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    else {
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({ username: req.params.username, password: hash});
      console.log(hash, newUser)
      res.status(200).send(newUser);
    }
  }
  catch (error)  {
    console.log(error)
  }
});

  module.exports = router;
