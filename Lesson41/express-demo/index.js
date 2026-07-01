const express = require('express');
const myLogger = require('./middleware/logger');

// Start express application
const app = express();

const port = 3009;

// Middleware
app.use(express.json());
app.use(myLogger);


// Routes (endpoints)
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/', (req, res) => {
  console.log(req.body);

  if (!req.body.name || !req.body.age) {
    return res.status(400).send({error: 'Name and age are required'});
  } else {
    const {name, age} = req.body;
    // Validate the data, maybe create a user in your database then return the response below

    res.send({data: { name: name.toUpperCase(), age: age }});
  }

});


app.put('/', (req, res) => {
  res.send('Put request received');
});

app.delete('/', (req, res) => {
  res.send('Delete request received');
});

// Start the server
app.listen(port, () => {
  console.log('Started express application....');
  console.log(`Listening on port ${port}`);
});