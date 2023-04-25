const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());


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

// app.get('/api/items/:Item/checkout', async (req, res) => {
//   try {
//     const item = req.params.Item;
//     const quant = req.params.Quantity;
//     const items = await InvItem.findOneAndUpdate(
//       { $inc: { Quantity: -quant } } 
//     );
//     if (!items) {
//       return res.status(404).send({ error: 'Item not found' });
//     }
//     console.log(items);
//     res.send(items);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ error: 'Internal server error' });
//   }
// });

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
    if (!items) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

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
      // items.Quantity += parseInt(req.body.Quantity)
      // const updated = await items.save();
      // res.send(updated);
      res.send(updated)
    }
  } catch (err){
    res.status(500).send({ error: 'Internal server error' });
  }
});


