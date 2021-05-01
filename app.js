var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var generate = require('./routes/generate');
var fetch = require('./routes/fetch');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/generate', generate);
app.use('/fetch', fetch);

app.use(function (err, req, res, next) {
    if (err.message === 'BAD_REQUEST') {
        res.status(400).send('Invalid params'); // TODO: can be more specific about the error
    } else {
        res.sendStatus(500);
    }
});

module.exports = app;
