const winston = require('winston');
const path = require('path');
const { app } = require('electron');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(app.getPath('userData'), 'app.log') }),
    new winston.transports.Console()
  ]
});

module.exports = logger;