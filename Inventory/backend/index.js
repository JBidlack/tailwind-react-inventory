const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
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

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("Inventory").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

//Routes

app.get('/api/items', async (req, res) => {
  try {
    await client.connect();
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
  } finally {
    await client.close();
  }
});

app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  try {
    await client.connect();
    const database = client.db('inventory');
    const collection = database.collection('Office_Inventory');
    const item = await collection.findOneAndUpdate(
      { _id: id, inStock: true },
      { $inc: { quantity: -quantity }, $set: { inStock: { $cond: { if: { $lte: ['$quantity', quantity] }, then: false, else: true } } } }
    );
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.send(item);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});
