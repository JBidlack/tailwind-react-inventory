const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const router = new express.Router();
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE;

mongoose.connect(uri, 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("DataBase Connected")).catch((err)=>{
    console.log(err);
});

const schema = new mongoose.Schema({
  Item: {type: String, required: true},
  unit: {type: String, required: true},
  Quantity: {type: Number, required: true},
  Reorder: {type: Number, required: true},
});

const officeInventory = mongoose.model('officeInventory', schema);

router.post("/data", async (req, res) => {
  const {Item, unit, Quantity, Reorder } = req.body;
  const newItem = new officeInventory({ Item, unit, Quantity, Reorder });
  await newItem.save();
  res.send(newItem);
})




// app.get('/items', async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db('Inventory');
//     const collection = database.collection('Office_Inventory');
//     const query = { inStock: true };
//     const items = await collection.find(query).toArray();
//     res.send(items);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ error: 'Internal server error' });
//   } finally {
//     await client.close();
//   }
// });

// app.put('/items/:id', async (req, res) => {
//   const id = req.params.id;
//   const { quantity } = req.body;
//   try {
//     await client.connect();
//     const database = client.db('inventory');
//     const collection = database.collection('Office_Inventory');
//     const item = await collection.findOneAndUpdate(
//       { _id: id, inStock: true },
//       { $inc: { quantity: -quantity }, $set: { inStock: { $cond: { if: { $lte: ['$quantity', quantity] }, then: false, else: true } } } }
//     );
//     if (!item) {
//       return res.status(404).send({ error: 'Item not found' });
//     }
//     res.send(item);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ error: 'Internal server error' });
//   } finally {
//     await client.close();
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
