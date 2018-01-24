process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.TZ = 'Asia/Shanghai';

const config = require('./config/config');
const models = require('./app/models');
const app = require('./config/express')();
app.locals.moment = require('moment');

models.sequelize.sync().then(() => {
  app.listen(config.serverConfig.serverPort, () => {
    console.log(`Server running at ${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
  });
});
