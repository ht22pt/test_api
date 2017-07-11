/* eslint-disable strict */
'use strict';

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var winston = require('winston');
var moment = require('moment');
var fs = require('fs');
var logDir = 'logs';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level:            'debug',
      filename:         logDir + '/all-logs.log',
      handleExceptions: true,
      json:             true,
      maxsize:          10485760, // 10MB
      maxFiles:         20,
      colorize:         false,
      timestamp:        function () {
        return moment().format('DD/MM/YYYY @ HH:mm:ss');
      }
    }),
    new winston.transports.Console({
      level:            'debug',
      handleExceptions: true,
      json:             false,
      colorize:         true,
      timestamp:        function () {
        return moment().format('DD/MM/YYYY @ HH:mm:ss');
      }
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function (message, encoding) {
    logger.info([message, encoding]);
  }
};
