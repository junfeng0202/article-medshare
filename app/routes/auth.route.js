const router = require('express').Router();
const authController = require('../controllers/auth.controller');

const prefix = '/auth';
// 登录
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/token', authController.authToken);

// 注册用户（目前设置只有超级管理员有这个权利）
router.post('/register', authController.isLogin, authController.isSuperManager, authController.register);

// 获取七牛云上传token的接口
router.get('/qiNiuToken', /* authController.isLogin, */authController.getQiNiuToken);

module.exports = function (app) {
  app.use(prefix, router);
};
