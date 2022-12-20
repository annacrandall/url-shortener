require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDB = require('mongodb'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 
const app = express(); 

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}); 
//set up mongoose package 

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const shortURL = mongoose.model('shortURL', new mongoose.Schema({
  original_url : String, 
  short_url: String,
})); 
// create schema + model to store/save input url's 

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello freeCodeCamp cert' });
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
