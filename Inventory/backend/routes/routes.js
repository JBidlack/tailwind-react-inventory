const express = require('express');
const route = new express.Router();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());


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

  app.get('/api/items/:Item', async (req, res) => {
    try{
      await client.connect();
      const { Item } = req.params;
      const items = InvItem.find({ Item })
      res.send(items);
    }
    catch(error){
      console.log(err);
      res.status(500).send({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
  });