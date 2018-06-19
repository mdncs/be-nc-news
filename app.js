const app = require('express')();
const express = require('express');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URI || require('./config');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.connect(DB_URL, () => {
    console.log(`Connected to ${DB_URL}`);
});

app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.json());
app.use('/api', apiRouter);

// error handling
app.use('/*', (req, res, next) => {
    next({ status: 404, msg: 'Page not found' });
});

app.use((err, req, res, next) => {
    err.status
        ? res.status(err.status).send(err.msg)
        : res.status(500).send('Internal server error');
})


module.exports = app;