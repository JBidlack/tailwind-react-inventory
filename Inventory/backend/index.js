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

export const InvItem = mongoose.model('InventoryItems', schema);

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

    // const database = client.db('Inventory');
    // const collection = database.collection('InventoryItems');
    // const items = await collection.find().toArray();
    // res.send(items);
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

app.post('/api/items/:Item', async (req, res) => {
  try{
    const items = await InvItem.findOne({ Item: req.params.Item });
    if (!items){
      const newItem = new InvItem({
        _id: new mongodb.ObjectId(),
        Item: req.params.Item,
        ...req.body,
    });
    const savedItem = await newItem.save();
    res.send(savedItem);
    } else {
      items.Quantity += parseInt(Quantity)
      const updated = await items.save();
      res.send(updated);
    }
  } catch (err){
    res.status(500).send({ error: 'Internal server error' });
  }
})
