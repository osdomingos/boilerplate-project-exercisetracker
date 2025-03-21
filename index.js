const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Conectar ao MongoDB com tratamento de erro assíncrono
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Falha ao conectar ao MongoDB:', err))


// Definição do Schema User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
}, { versionKey: false})

let User = mongoose.model("User", userSchema);

// Post para novo usuário
app.post('/api/users', async (req, res) => {
  let username = req.body.username;
  
  try {
    let foundUser = await User.findOne({ username });
    if (!foundUser) {
      foundUser = await new User({ username }).save();
    }

    res.json({ username: foundUser.username, _id: foundUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
// Definição do Schema Exercise
const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: {type: Number, required: true},
  date: Number,
})

let Exercise = mongoose.model("Exercise", exerciseSchema);

// Definição do Schema Log
const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [{
    description: String,
    duration: {type: Number, required: true},
    date: Number
  }]
})

let Log = new mongoose.model("Log", logSchema)
*/




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
