const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// app.get('/api', (req, res) => {
//   const item = {
//     _id: String,
//     Item: String,
//     unit:String,
//     Quantity:Number,
//     Reorder: Number,
//   }
// });

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

    // const database = client.db('Inventory');
    // const collection = database.collection('InventoryItems');
    // const items = await collection.find().toArray();
    // res.send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  } 
});

// app.get('/api/items/:Item', async (req, res) => {
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

app.put('/api/items', async (req, res) => {
  try {
    const { item } = req.params.Item;
    const items = await InvItem.findOneAndUpdate(
    { Item: item },
    { $inc: { Quantity: -items.Quantity } }, 
    {useFindAndModify: false},
    (err) => {
        if (err){
          console.log(err);
        }
        else {
          console,log("Success!");
        }
      }
        );
      if (!items) {
        return res.status(404).send({ error: 'Item not found' });
      }
      res.send(items);
    } catch (err) {
      console.log(err.res.data);
      res.status(500).send({ error: 'Internal server error' });
  } 
});
