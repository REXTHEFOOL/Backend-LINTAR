const pino = require('pino');

const createLogger = (name = 'app') =>
  pino({
    name,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  });

module.exports = createLogger;
