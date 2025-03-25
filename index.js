const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
}, { versionKey: false });

let User = mongoose.model("User", userSchema);

const exerciseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date
})

let exercise = mongoose.model("Exercise", exerciseSchema);

app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  const user = await User.findOne({ username: username });
  let data = user;
  try {
    if (!user) {
    const newUser = new User({ username: req.body.username });
    data = await newUser.save();
    }
    res.json({ username: data.username, _id: data._id.toString() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/api/users/:id/exercises', async (req, res) => {
  const id = req.params.id;

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
