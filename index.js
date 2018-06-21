const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();
app.use(jsonParser);

app.get('/api/users', function(req, res){
  console.log('Muestra todos los usuarios');
  res.status(200).json([]);
});

app.listen(8080, function(){
  console.log('Server corriendo en localhost:8080');
});