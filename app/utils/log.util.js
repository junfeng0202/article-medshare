const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' }, // 控制台输出
    infoLogger: { type: 'file', filename: `${__dirname}/../../logs/info.log` },
    errLogger: { type: 'file', filename: `${__dirname}/../../logs/err.log` },
  },
  categories: {
    errLogger: { appenders: ['errLogger'], level: 'error' },
    infoLogger: { appenders: ['infoLogger'], level: 'info' },
    normal: { appenders: ['console'], level: 'info' },
    default: { appenders: ['console'], level: 'trace' },
  },
  replaceConsole: true,
});

exports.getLog4Js = function () {
  return log4js;
};

exports.getLogger = function (name = 'normal') {
  const logger = log4js.getLogger(name);
  return logger;
};
