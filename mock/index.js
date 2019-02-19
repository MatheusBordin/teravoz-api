const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const actionsService = require('./services/actions');
const userRepository = require('./repositories/user');
const Call = require('./models/call');
const app = express();

// Start db
mongoose.connect(
    'mongodb://localhost:27017/teravoz',
    { useNewUrlParser: true },
    (err) => console.log(err || 'MongoDB connected.')
);

// Configure
app.use(cors());
app.use(bodyParser.json());

// Start service.
actionsService.init();

// Routes
app.post('/call', async (req, res) => {
    const users = await userRepository.find({}).exec();
    const phones = [...users.map(x => x.callNumber), '123123', '345345', '456456', '293847'];
    const phoneIdx = Math.floor(Math.random() * phones.length);
    const phone = phones[phoneIdx];
    const call = new Call('call.new', null, null, phone);

    actionsService.addCall(call);

    res.json(call);
});

app.post('/actions', (req, res) => {
    const delegate = req.body;
    actionsService.updateWithDelegate(delegate);

    res.sendStatus(200);
});

// Init server
http.createServer(app)
    .listen(5000, (err) => console.log(err || 'Teravoz mock API listening on port 5000'));

