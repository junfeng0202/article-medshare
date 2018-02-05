const url = require('url');
const config = require('../../config/config');
const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const qiniu = require('qiniu');
const crypto = require('crypto');
const rp = require('request-promise');
const Model = require('../models/index');
const logger = require('../utils/log.util').getLogger('infoLogger');
const stateSetting = '123^%$(IJUHBFGdds';

exports.authToken = (req,res)=>{
  const timestamp = req.query.timestamp;
  const nonce= req.query.nonce;
  const signature = req.query.signature;
  const token = config.wechatConfig.Token;
  const echostr = req.query.echostr || '';
  let arr = [token,nonce,timestamp];
  let str = arr.sort().join('');res.end(str);
  if(crypto.createHash('sha1').update(str).digest('hex') == signature && echostr){
    res.end( req.query.echostr);
  } else{
	  res.end('fail');
  };
}


// 中间件：判断是否已经登录
exports.isLogin = (req, res, next) => {
	let user = req.session.user || {};

	// 记载用户的起始url，方便登录/注册后跳转
	const originalUrl = url.format({
		protocol: req.protocol,
		host: req.hostname,
		pathname: req.originalUrl,
	});

	req.session.originalUrl = originalUrl;

	if (!user || !user.userId) {
		// console.log(user);

		res.redirect(`${config.serverConfig.serverHost}:${config.serverConfig.serverPort}/auth/login`);
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
	const appid = config.wxConfig.appId;
	const redirectUri = config.serverConfig.serverHost+'/auth/getCode';
	// const base64Url = new Buffer(redirectUri,'base64');
  // console.log(encodeURIComponent(redirectUri));
  // console.log(redirectUri);
	const weixin_auth_url = 'https://open.weixin.qq.com/connect/qrconnect?appid='+appid+'&redirect_uri='+ encodeURIComponent(redirectUri) +'&response_type=code&scope=snsapi_login&state='+stateSetting+'#wechat_redirect';
	res.redirect(weixin_auth_url);
};

// 通过code换取网页授权access_token
exports.getCode = (req,res)=>{
  // console.log(req.query);
  (async () => {
    const code = req.query.code;
    const state = req.query.state;
    const httpUtil = new HttpUtil(req, res);
    if(!code || state !== stateSetting){
        httpUtil.sendJson(constants.HTTP_FAIL, '获取授权失败');
        return ;
    }
    const tokenInfo = await getAccessToken(code);
    await userLogin(req,res,tokenInfo);
  })()
}

// 获取accesstoken
const getAccessToken = async (code) => {
  const appid = config.wxConfig.appId;
  const appSecret = config.wxConfig.appSecret;
  const url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+appSecret+'&code='+code+'&grant_type=authorization_code';

  //调用api，获取accessToken
  const token = await rp(url);
  return JSON.parse(token);
}

// 拉去用户个人信息
const getUserInfo = async (token,openid) => {
  const url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ token +'&openid='+ openid +'&lang=zh_CN';
  const body = await rp(url);
  return JSON.parse(body);
}

const userLogin = async (req,res,result) => {
  console.log(result);
 // 判断用户是否存在
  let user = await Model.User.findOne({where:{'userId':result.unionid}});

  // 如果用户存在，记录session，否则，新增用户，记录session
  if(!user){
    const userInfo = await getUserInfo(result.access_token,result.openid);
    // console.log(userInfo);
    /*
    { openid: 'ov-6i03RxuCk0FGqceqrjdaCJo_U',
      nickname: '俊风',
      sex: 1,
      language: 'zh_CN',
      city: '武汉',
      province: '湖北',
      country: '中国',
      headimgurl: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erHJnq6o3LsAo97icr0m68mGebHATkWMhSxYkM2HTdueJB7PcZCXbBEEZqiatuxOKwF6emhslQjELnQ/132',
      privilege: [],
      unionid: 'o82p90nIlafIKFBJAFO4G1e_z6ZA'
    }
    */
    // 将用户信息存入数据库
    user = await Model.User.create({ userId: userInfo.unionid, openId:userInfo.openid, userName:userInfo.nickname, sex: userInfo.sex, province:userInfo.province, city: userInfo.city, country: userInfo.country, headImgUrl:userInfo.headimgurl});
  }
  // console.log(user);
  //记录session
  req.session.user = user.dataValues;
  //跳转到文章页面
  res.redirect(`${config.serverConfig.serverHost}/news`);
}

exports.logout = (req, res) => {
  req.session.user= {};
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
	  return ;
  }).catch((err) => {
    logger.info(err);
    httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    return ;
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

