const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const actionsService = require('./services/actions');
const Call = require('./models/call');
const app = express();

// Configure
app.use(cors());
app.use(bodyParser.json());

// Start service.
actionsService.init();

// Routes
app.post('/call/:phone', async (req, res) => {
    const { phone } = req.params;
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

