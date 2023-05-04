const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()



const loginToken = process.env.TOKEN;

// schema
const schema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', schema);

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password)
    const user = User.findOne({username: req.body.username});

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, loginToken);
      res.json({token})
    }
    else {
      return res.status(400).json({ error: 'User does not exist. Please register.' });
    }

  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body;
    const exists = await User.findOne({username: username});
    console.log(exists)
    if (exists) {
      console.log(exists)
      return res.status(400).json({ error: 'Username already taken' });
    }
    else {
      console.log(exists)
      const hash = await bcrypt.hash(password, 10);

      const user = new User({ username: username, password: hash});
      res.status(200).send(user);
    }
  }
  catch (error)  {
    console.log(error)
  }
});

  module.exports = router;
