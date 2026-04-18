const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const pinoHTTP = require('pino-http');

const config = require('./config');
const logger = require('./logger')('app');
const routes = require('../api/routes');

const gachaController = require('../api/components/gacha/gacha-controller');

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(require('method-override')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pinoHTTP({ logger }));

app.use(`${config.api.prefix}`, routes());

app.post(`${config.api.prefix}/gacha`, gachaController.play);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    statusCode: err.status || 500,
    error: err.code || 'UNKNOWN_ERROR',
    message: err.message || 'An error has occurred',
  });
});

module.exports = app;
