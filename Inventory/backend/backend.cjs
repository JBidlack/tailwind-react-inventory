const  InvItem = require(".");
const express = require("express");
const router = express.Router();

router.get('/api/items', async (req, res) => {
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
