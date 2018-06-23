const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const jsonParser = bodyParser.json();

const app = express();
app.use(jsonParser);

app.get('/api/users', function(req, res){
  console.log('Muestra todos los usuarios');
  res.status(200).json([]);
});

mongoose.connect('mongodb://localhost/coderoom-api', err => {
  if (err) {
      console.log(err);
  }
  app.listen(8080, () => {
    console.log('Server corriendo en localhost:8080');
  })
  .on('error', err => {
      mongoose.disconnect();
      console.log(err);
  });
});