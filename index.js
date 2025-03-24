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

// Criar User class
class User {
  constructor(username) {
    this.username = String(username);
    this._id = uuidv4();
  }
};

// Fazer api para cadastro de novos usuários
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  let user = new User(username);
  res.json({ _id: user._id, username: user.username });
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
