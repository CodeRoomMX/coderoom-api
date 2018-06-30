const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');
const jsonParser = bodyParser.json();

const app = express();
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/coderoom-api';
app.use(jsonParser);

app.get('/api/users', function(req, res){
  console.log('Muestra todos los usuarios');
  User.find()
  .then(users => {
    res.status(200).json(users);
  });
});

app.get('/api/users/:id', function(req, res){
  User.findOne({_id: req.params.id})
  .then(user => {
    if(!user){
      return res.status(404).send('Not found');
    }
    res.status(200).json(user);
  })
});

app.post('/api/users', function(req, res){
  console.log('Guarda usuarios');
  const { username, email, password } = req.body;
  bcrypt.hash(password, 8)
  .then(hashed => {
    return User.create({
      username,
      email,
      password: hashed
    });
  })
  .then(user => {
    res.status(201).json(user);
  });
});

app.put('/api/users/:id', function(req, res){
  console.log('Actualiza usuarios');
  let hashPromise;

  if(req.body.password){
    hashPromise = bcrypt.hash(req.body.password, 8);
  }else{
    hashPromise = Promise.resolve();
  }

  hashPromise
  .then(hashed => {
    const fields = ['password', 'username'];
    let updateObject = {};
    fields.forEach(field => {
      if(req.body[field]){
        updateObj[field] = req.body[field];
      }
      if(hashed) updateObject.password = hashed;
    })
    return User.findOneAndUpdate({ _id: req.params.id }, updateObject, {new: true, upsert: true});
  })
  .then(user => {
    res.status(200).json(user);
  })
});

app.delete('/api/users/:id', function(req, res){
  console.log('Borra usuario');
  User.deleteOne({_id: req.params.id})
  .then(user => {
    res.status(204).end();
  });
});

mongoose.connect(DATABASE_URL, err => {
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
