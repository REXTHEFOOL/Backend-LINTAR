const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');

const app = server;

app.listen(port, (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');
  process.exit(1);
});
