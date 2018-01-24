const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const newsController = require('../controllers/news.controller');

const prefix = '/news';
router.get('/', authController.isLogin, newsController.index);
router.get('/search', authController.isLogin, newsController.findNewsList);
router.get('/edit/:newsId', authController.isLogin, newsController.edit);
router.get('/add', authController.isLogin, newsController.add);
// router.get('/tests/:testId', authController.isLogin, newsController.qryTestDetails);
router.post('/save', authController.isLogin, newsController.saveData);
// router.post('/tests/edit', authController.isLogin, newsController.editTests);
router.get('/del/:newsId', authController.isLogin, newsController.delNews);

module.exports = function (app) {
  app.use(prefix, router);
};
