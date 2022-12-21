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
console.log(mongoose.connection.readyState)
//set up mongoose package 
const schema = new mongoose.Schema({url: 'string'}); 
const Url = mongoose.model('Url', schema); 
// create schema + model to store/save input url's 

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended : false})); 

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello freeCodeCamp cert' });
}); 
// first API endpoint 

app.post('/api/shorturl', async function (req,res){
  console.log(req.body)
  try {
    const url = new Url({url: req.body.url})
     await url.save((err, data) => {
    res.json({created : true})
  })
  res.json({original_url : req.body.url, short_url : 1})
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
