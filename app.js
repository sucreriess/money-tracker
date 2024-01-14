const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT =  3000;
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/money-tracker');
const expenseSchema = new mongoose.Schema({
  transactionName: String,
  amount: Number,
});

const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      const expenses = await Expense.find({});
      res.sendFile(__dirname + '/index.html');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

  app.post('/addExpense', async (req, res) => {
    try {
      const newExpense = new Expense({
        transactionName: req.body.transactionName,
        amount: req.body.amount,
      });
  
      await newExpense.save();
      const expenses = await Expense.find({});
    
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.get('/getExpenses', async (req, res) => {
    try {
      const expenses = await Expense.find({});
      res.json(expenses);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
