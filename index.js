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

const logSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [],
  count: Number
}, { versionKey: false })

let Log = mongoose.model("Log", logSchema);

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
  let logCount = 1;
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
      date: date
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
    res.status(500).json({ error: 'Internal Server Error: Exercises' });
  }

  try {
    console.log('tentando aqui')
    let newLog;
    console.log(user.username)
    const logado = await Log.findOne({ username: user.username});
    console.log(logado)
    if (!logado) {
      console.log('Log criado')
      newLog = new Log({
        username: user.username,
        log: [{
            description: description,
            duration: duration,
            date: date.toISOString().split('T')[0]
          }],
          count: 1
      })
      await newLog.save();
    } else {
      console.log('Tentando adicionar exercício')
      logado.log.push({
        description: description,
        duration: duration,
        date: date.toISOString().split('T')[0]
      });
      logado.count++;
      await logado.save();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error: Logs' });
  }
})

app.get('/api/users/:id/logs', async (req, res) => {
  const id = req.params.id;
  const from = req.params.from;
  const to = req.params.to;
  const limit = req.params.limit;

  const user = await User.findById(id);
  const log = await Log.findOne({ username: user.username })

  console.log('\n\n')
  console.log(user)
  console.log(log)
  console.log('\n\n')

  res.json({ username: log.username,
    count: log.count,
    _id: id.toString(),
    log: log.log
    })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
