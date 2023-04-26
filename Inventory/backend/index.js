const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const email = process.env.EMAIL;
const emailto = process.env.EMAILRECIP;
const pass = process.env.PASSWORD;
const uri = process.env.DATABASE;
const port = 27017 || 3000;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(uri || 'mongodb://localhost/Inventory');

//verifies mongodb connection was successful
mongoose.connection.on('connected', () => {
  console.log("We have liftoff!");
});

// schema
const schema = mongoose.Schema({
  _id: String,
  Item: String,
  unit:String,
  Quantity:Number,
  Reorder: Number,
});

const InvItem = mongoose.model('InventoryItems', schema);

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

//Routes
app.get('/api/items', async (req, res) => {
  try {
    InvItem.find({ })
      .then((data) => {
        console.log("Data: ", data);
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
      })
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  } 
});

app.put('/api/items/:Item/checkout', async (req, res) => {
  try {
    const { Quantity } = req.body;
    if (isNaN(+Quantity)) {
      return res.status(404).send({ error: 'Quantity must be a number' });
    }
    const items = await InvItem.findOneAndUpdate(
      { Item: req.params.Item },
      { $inc: { Quantity: -parseInt(Quantity) } },
      { new: true }
    );
    if (parseInt(items.Quantity) <= parseInt(items.Reorder)) {
      sendEmail(items.Item);
    }
    if (!items) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.get('/api/items/:Item', async (req, res) => {
  try {
    const item = req.params.Item;
    const items = await InvItem.findOne({ Item: item });
    if (!items) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// app.put('/api/items/:Item/checkout', async (req, res) => {
//   try {
//     const { Quantity } = req.body;
//     if (isNaN(+Quantity)) {
//       return res.status(404).send({ error: 'Quantity must be a number' });
//     }
//     const items = await InvItem.findOneAndUpdate(
//       { Item: req.params.Item },
//       { $inc: { Quantity: -parseInt(Quantity) } },
//       { new: true }
//     );

//     if (req.params.Quantity <= req.params.Reorder){
//       sendEmail(req.params.Item);
//     }

//     if (!items) {
//       return res.status(404).send({ error: 'Item not found' });
//     }
//     res.send(items);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ error: 'Internal server error' });
//   }
// });

app.put('/api/items/:Item/checkin', async (req, res) => {
  try{
    const name = req.params.Item;
    const { unit, Quantity, Reorder } = req.body;
    const items = await InvItem.findOne({ Item: name });
    if (!items){
      const newItem = new InvItem({
        _id: new mongodb.ObjectId(),
        Item: req.params.Item,
        unit: unit,
        Quantity: parseInt(Quantity),
        Reorder: parseInt(Reorder),
    });
    const savedItem = await newItem.save();
    res.send(savedItem);
    } else {
      const updated = await InvItem.findOneAndUpdate(
        { Item: req.params.Item },
        { $inc: { Quantity: parseInt(Quantity) } },
        { new: true }
      );
      res.send(updated)
    }
  } catch (err){
    res.status(500).send({ error: 'Internal server error' });
  }
});

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    password: pass
  }
});

const sendEmail = (item) => {
  const mailOpt = {
    from: email,
    to: emailto,
    subject: `Your ${item} is running low!`,
    text: `Our records indicate that ${item} is running low. Please be sure to order more as soon as possible.`
  }

  mailer.sendMail(mailOpt, (error, info) => {
    if (error){
      alert(error);
    }
    else {
      alert(`${item} is running low. An email has been sent to the department supervisor.`);
    }
  })
}


