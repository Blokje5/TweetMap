global.__base = __dirname + '/';
const twitter = require('./twitter-connector/twitter.js')
const path = require('path')
const express = require('express');
const app = express();
const socket_io = require( "socket.io" );

const io = socket_io();
app.io = io;
// Routes
const index = require(global.__base + 'routes/index');

// Set pug engine and specify views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index)


function constructPoint(coordinates) {
    return {
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    type: 'Feature'
            }
}

io.of('/tweet').on('connection', function (socket) {
  console.log('connected');
  twitter.createStream((coordinates) => {
      socket.emit('tweet', constructPoint(coordinates));
  })
});


module.exports = app