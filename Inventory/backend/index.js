const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const  { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const router = require('./routes/loginReg.js')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', router)

const email = process.env.EMAIL;
const emailto = process.env.EMAILRECIP;
const pass = process.env.PASSWORD;
const uri = process.env.DATABASE;
const empList = process.env.EMPDB;
const userConn = process.env.USERDB;
const port = 27017 || 3000;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const invDB = mongoose.createConnection(uri);
const employeeList = mongoose.createConnection(empList);
const UserLogin = mongoose.createConnection(userConn);

UserLogin.on('connected', () => {
  console.log('users can log in')
});

require('./routes/loginReg')

UserLogin.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

//verifies mongodb connection was successful
invDB.on('connected', () => {
  console.log("We have liftoff!");
});

//verifies mongodb connection was successful
employeeList.on('connected', () => {
  console.log("We have liftoff employee list!");
});

// schema
const invSchema = mongoose.Schema({
  _id: String,
  Item: String,
  unit:String,
  Quantity:Number,
  Reorder: Number,
});

const empSchema = mongoose.Schema({
  _id: String,
  Name: String,
  Dept: String,
  Email: String,
  Admin: Boolean
})

const InvItem = invDB.model('InventoryItems', invSchema);

const EList = employeeList.model('Employees', empSchema);

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

//Routes
app.get('/api/items', async (req, res) => {
  try {
    InvItem.find({ })
      .then((data) => {
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

    if (!items) {
      return res.status(404).send({ error: 'Item not found' });
    }
    res.send(items);

    if (parseInt(items.Quantity) <= parseInt(items.Reorder)) {
      sendEmail(items.Item);
    }
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

app.get('/api/employees', async (req, res) => {
  try {
    EList.find({ })
      .then((emps) => {
        res.send(emps);
      })
      .catch((error) => {
        console.log(error);
      })
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  } 
});

app.put('/api/employees/:Name/new', async (req, res) => {
  try{
    const name = req.params.Name;
    const{ Dept, Email, Admin } = req.body;
    const existing = await EList.findOne({Name: name});

    if(existing){
      alert("This name already exists!");
    }
    else {
      const newEmp = new EList({
        _id: new mongodb.ObjectId(),
        Name: req.params.Name,
        Dept: Dept,
        Email: Email,
        Admin: Admin
      });
      const saved = await newEmp.save();
      res.send(saved);
    }
  }
  catch(err){
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.put('/api/employees/:Name/edit', async (req, res) => {
  try{
    const name = req.params.Name;
    const{ Name, Dept, Email, Admin } = req.body;
    console.log(name, Name, Dept)
      const updated = await EList.findOneAndUpdate(
        { Name: name },
        {Name: Name,
        Dept: Dept,
        Email: Email,
        Admin: Admin},
        {new: true }
      );
      res.send(updated)
  } catch (err){
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.get('/api/employees/:Name', async (req, res) => {
  try {
    const name = req.params.Name;
    
    const empId = await EList.findOne({ Name: name });
    res.send(empId);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.delete('/api/employees/:Name/delete', async (req, res) => {
  
  try {
    const name = req.params.Name;
    await EList.findOneAndDelete({ Name: name });
  } catch (err) {
    console.log(err);
  }
}); 

const mailer = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: email,
    pass: pass
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
      console.log(error);
    }
    else {
      console.log(`${item} is running low. An email has been sent to the department supervisor.`);
    }
  })
}


