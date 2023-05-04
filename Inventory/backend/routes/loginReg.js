const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

const loginToken = process.env.TOKEN;

// schema
const schema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', schema);

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = User.findOne({username: username});

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username }, loginToken);
      res.json({token})
    }
    else {
      return res.status(400).json({ error: 'User does not exist. Please register.' });
    }

  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body;
    const exists = await User.findOne({username: username});

    if (exists) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    else {
      const hash = await bcrypt.hash(password, 10);

      const user = new User({ username: username, password: hash});
      res.status(201).send(user);
    }
  }
  catch (error)  {
    console.log(error)
  }
});

  module.exports = router;
