const url = require('url');
const config = require('../../config/config');
const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const qiniu = require('qiniu');
const crypto = require('crypto');
const Model = require('../models/index');
const logger = require('../utils/log.util').getLogger('infoLogger');

exports.authToken = (req,res,next)=>{
  const timestamp = req.query.timestamp;
  const nonce= req.query.nonce;
  const signature = req.query.signature;
  const token = config.wechatConfig.Token;
  let arr = [token,nonce,timestamp];
  let str = arr.sort().join('');
  if(crypto.createHash('sha1').update(str).digest('hex') == signature){
    res.end( req.query.echostr);
  };
}

// 中间件：判断是否已经登录
exports.isLogin = (req, res, next) => {
  const user = req.session.user || {};

  // 记载用户的起始url，方便登录/注册后跳转
  const originalUrl = url.format({
    protocol: req.protocol,
    host: req.hostname,
    pathname: req.originalUrl,
  });

  req.session.originalUrl = originalUrl;

  if (!user || !user.managerId) {
    res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}`);
  } else {
    next();
  }
};

// 登录页面
exports.loginPage = (req, res) => {
  res.render('login');
};

// 请求登录
exports.login = (req, res) => {

  const weixin_auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect';


  const account = req.body.account || '';
  let password = req.body.password || '';
  const httpUtil = new HttpUtil(req, res);

  if (!password || !account) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数不能为空');
    return;
  }

  password = crypto.createHash('md5').update(password).digest('hex');
  // console.log(password);
  Model.User.findOne({ where: { account } }).then((managerInfo) => {
    if (!managerInfo.dataValues || password !== managerInfo.dataValues.password) {
      httpUtil.sendJson(constants.HTTP_FAIL, '账户或者密码错误');
      return;
    }

    req.session.user = {
      managerId: managerInfo.dataValues.managerId,
      account: managerInfo.dataValues.account,
      type: managerInfo.dataValues.type,
    };

    httpUtil.sendJson(constants.HTTP_SUCCESS, '登入成功', '/news');

    // res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}/index`);
  }).catch((err) => {
    logger.info(err);
    // console.log(err);
    httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
  });
};

exports.logout = (req, res) => {
  req.session.manager = {};
  res.redirect('/');
};
// 请求注册
exports.register = (req, res) => {
  const account = req.body.account || '';
  let password = req.body.password || '';
  const type = parseInt(req.body.type, 0) || 2;
  const httpUtil = new HttpUtil(req, res);

  if (!password || !account) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数不能为空');
    return;
  }

  password = md5.update(password).digest('hex');
  Model.Manager.create({ account, password, type }).then((managerInfo) => {
    if (!managerInfo.dataValues) {
      httpUtil.sendJson(constants.HTTP_FAIL, '账户注册失败');
      return;
    }
    httpUtil.sendJson(constants.HTTP_SUCCESS, '账户注册成功');
  }).catch((err) => {
    logger.info(err);
    httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
  });
};

// 获取七牛云的上传凭证
exports.getQiNiuToken = (req, res) => {
  const mac = new qiniu.auth.digest.Mac(config.qiNiuConfig.accessKey, config.qiNiuConfig.secretKey);
  const options = {
    scope: config.qiNiuConfig.bucket,
    returnBody: `{"key":"$(key)","hash":"$(etag)","state":"SUCCESS","url":"${config.qiNiuConfig.showLink}/$(key)","title":"$(key)","original":"$(key)"}`,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  // console.log(req.body);
  res.end(uploadToken);
};

