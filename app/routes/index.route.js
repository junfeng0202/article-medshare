/* eslint-disable linebreak-style */
const router = require('express').Router();
// const indexController = require('../controllers/index.controller');
const authController = require('../controllers/auth.controller');

const prefix = '/';
router.get('/', authController.login);
// router.get('/index', authController.isLogin, indexController.index);
// router.post('/save', authController.isLogin, indexController.save);

module.exports = function (app) {
  app.use(prefix, router);
};
