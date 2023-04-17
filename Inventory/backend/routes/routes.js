const app = express();

app.use(cors());
app.use(express.json());

app.get('/items', async (req, res) => {
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

  app.get('/items/')