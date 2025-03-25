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
  date: { type: Date }
}, { versionKey: false })

let Exercise = mongoose.model("Exercise", exerciseSchema);

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

app.get('/api/users', async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/api/users/:id/exercises', async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const user = await User.findById(id);
  try {
    const newExercise = new Exercise({
      username: user.username,
      description: description,
      duration: duration,
      date: date,
      _id: user._id.toString()
    });
    const data = await newExercise.save();
    res.json({
      username: data.username,
      description: data.description,
      duration: data.duration,
      date: data.date.toISOString().split('T')[0],
      _id: data._id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
