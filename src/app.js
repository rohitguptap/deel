const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const routes = require('./routes/route');

const app = express();
app.use(bodyParser.json());
app.use(routes);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

module.exports = app;
