const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { v4: uuidv4} = require('uuid');

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Vars e listas
let listaDeUsers = [];

// Criar User class
class User {
  constructor(username) {
    this.username = String(username);
    this._id = uuidv4();
    this.exercise;

  }
};

// Fazer api para cadastro de novos usuários
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  let user = new User(username);
  let userObjct = { _id: user._id, username: user.username };
  listaDeUsers.push(userObjct )
  res.json(userObjct);
});

// Ver uma lista de usuários
app.get('/api/users', (req, res) => {
  res.json(listaDeUsers);
});

// Postar exercícios
app.post('/api/users/:id/exercises' , (req, res) => {
  let id = String(req.params.id);
  console.log(id);
  let usuario;
  let date = !req.body.date ? new Date().toDateString() : req.body.date.toDateString();
  console.log(date);
  console.log(listaDeUsers[0]._id);
  for (let i = 0; i < listaDeUsers.length; i++) {
    console.log(listaDeUsers[i]);
    if (listaDeUsers[i]._id == id) return usuario = listaDeUsers[i]
  }
  console.log(usuario);
  usuario.exercise = {
    username: usuario.username,
    description: String(req.body.description),
    duration: Number(req.body.duration),
    date: date
  };
  console.log(usuario.exercise);
  res.json(usuario);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
