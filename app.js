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

// transform coordinates into TopoJSON feature
function constructPoint(coordinates) {
    return {
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    type: 'Feature'
            }
}

// socket middleware
io.use((socket, next) => {
  const channel = socket.handshake.query.channel;
  if (channel != '' && channel != undefined) {
    return next();
  }
  return next(new Error('Topic is missing'));
});

// send tweet streams on connection
io.of('/tweet').on('connection', function (socket) {
  console.log('connected');
  const channel = socket.handshake.query.channel;
  twitter.createStream(channel, (coordinates) => {
      socket.emit('tweet', constructPoint(coordinates));
  })
});


module.exports = app