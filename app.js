global.__base = __dirname + '/';

const path = require('path')
const express = require('express');
const app = express();

// Routes
const index = require(global.__base + 'routes/index');

// Set pug engine and specify views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index)

app.listen(3000, () => console.log('Example app listening on port 3000!'))