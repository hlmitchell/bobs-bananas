const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const costController = require('./costController.js');
const PORT = 3000;

// connect to server
app.listen(PORT || 3000, (err) => {
  if (err) console.log('Could not connect');
  else console.log('Connected to 3000...');
});

// apply bodyparser to all routes
app.use(bodyParser.json());

/* API routes */

app.post('/findCost', 
  costController.checkDateFormatting, 
  costController.calculateCost, 
  (req, res) => res.send(res.locals.total));

app.use((err, req, res, next) => {
  res.status(400).send(err.message);
})

app.use('/*', (req, res) => {
  res.send('Not a valid route');
})
