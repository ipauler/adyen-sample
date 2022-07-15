const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');
console.log("started");
app.use(routes);

app.listen(3000);
