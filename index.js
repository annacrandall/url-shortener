require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoDB = require('mongodb'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 
const validUrl = require('valid-url'); 
const dns = require('dns'); 
const app = express(); 
const Schema = mongoose.Schema; 

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}); 
console.log(mongoose.connection.readyState)
//set up mongoose package 

const urlSchema = new Schema({
  original_url: {type: String, required: true},
  short_url: Number}); 
const Url = mongoose.model('Url', urlSchema); 
// create schema + model to store/save input url's 

const isUrlValid = async(url) => {
  let regex = /^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im

  let result = url.match(regex)
  let domain = result.reduce((acc, elem)=> elem.length < acc.length ? elem : acc);

    return new Promise((resolve, reject) => {
      dns.lookup(domain, (error, address) =>{
        if(error) reject(error)
        resolve(address)
        
      });
    });
}; 

const getDomainIp = async(url) => {
  const valid = await isUrlValid(url)
  return valid
}

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended : false})); 
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
mongoose.set('strictQuery', true); 
// app middleware

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello freeCodeCamp cert' });
}); 
// first API endpoint 

app.post('/api/shorturl', async function(req, res) {
  const {url} = req.body; 

  let isUrlValid = true 

  try {
    const ip = await getDomainIp(url) 
  } catch (error) {
    console.log(error) 
    res.json({ error: 'invalid url' });
    isUrlValid = false
  } 
  if (isUrlValid) {
    try {
      const urlSearch = await Url.find({original_url: url})

      console.log(urlSearch)
      
      if (urlSearch.length>0) {
        let {original_url : url , short_url : id} = urlSearch[0]

        res.json({original_url : url , short_url : id})
        urlIsNotInDB = false
      } 
    } catch (err) {
      console.log(err)
    }
  }
  if (isUrlValid) {
    try {
      const database = await Url.find({})
      const newObj = {original_url: url, short_url: database.length+1}
      const newUrl = new Url(newObj)
      res.json(newObj)
      const save = await newUrl.save()
    } catch (err) {
      console.log(err)
    }
  }
});

app.get('/api/shorturl/:short_url', async function(req, res) {
  let {short_url} = req.params
  console.log(short_url)
  
  try{
    short_url = parseInt(short_url)
    const search = await Url.find({short_url: short_url})
    let original = search[0]['original_url']
    if (!original.startsWith("https://")) 
      original ="https://".concat(original)
    console.log(search)
    res.redirect(original)
  } catch(err) {
    res.json({error: "There was an error, most likely the short_url path is invalid or doesn't exist"})
    console.log(err)
  }
});
  
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
