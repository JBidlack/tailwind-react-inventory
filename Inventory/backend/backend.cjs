const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://jbidlack:${}@cluster0.eelwcmd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(uri);

app.get('/items', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Inventory');
    const collection = database.collection('Office_Inventory');
    const query = { inStock: true };
    const items = await collection.find(query).toArray();
    res.send(items);
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
