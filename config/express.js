const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
// const fs = require('fs');
const path = require('path');
const session = require('express-session');
const logUtil = require('../app/utils/log.util');


// local require
const config = require('./config');

module.exports = function () {
  const app = express();

  // view engine setup.
  app.set('views', path.join(__dirname, '../app/views'));
  // app.set('view options', {debug:true});
  app.set('view engine', 'pug');

  // use log4js
  app.use(logUtil.getLog4Js().connectLogger(logUtil.getLogger('normal'), { level: 'INFO', format: ':method :url' }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.serverConfig.sessionSecret
  }));
  // app.use(csurf({ cookie: true }));

  // always last, but before user middleware.
  app.use(express.static(path.join(__dirname, '../public/')));

  // register user routes here.
  require('../app/routes/auth.route')(app);
  require('../app/routes/news.route')(app);
  require('../app/routes/ueditor.route')(app);


  // catch the 404 and render the 404 page.
  app.use((req, res) => {
    res.status(404);
    res.render('404');
  });

  // error handler,
  // eslint-disable-next-line no-unused-vars.
  app.use((err, req, res) => {
    res.status(err.status || 500);
    // console.log(err);
    res.render('500', { error: err.toString() });
  });

  return app;
};
