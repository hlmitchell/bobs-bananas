const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.get('/findCost', (req, res) => {

})

app.use('*', (err, req, res, next) => {
  console.log(err);
  res.send();
})

app.use('*', (req, res) => {
  res.send('Not a valid route');
})
