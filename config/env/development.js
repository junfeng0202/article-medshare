module.exports = {
  // server config
  serverConfig: {
    serverPort: 8111,
    serverHost: 'http://article.medsci-tech.com',
    sessionSecret: 'xsm_development_secret',
  },
  // mysql config
  mysqlConfig: {
    host: 'rm-2ze62b8v9ox9m35k7.mysql.rds.aliyuncs.com',
    port: 3306,
    database: 't_virus_source',
    username: 't_virus_source',
    password: 'test_123',
  },
  // redis config
  redisConfig: {
    host: '127.0.0.1',
    port: '6379',
    db: 5,
    // password: 'root',
    ttl: 1800,
    logErrors: true,
  },
  // qiniu config
  qiNiuConfig: {
    accessKey: 'unt5w-mSHycfoT9XPuonMFj49mu1XOcEs4pBO4vg',
    secretKey: '1Leh1VrCAXFutyg4hzSZ2vSPyNTeESrexYdc1S-H',
    upHost: 'qiniu.zone.Zone_z0',
    bucket: 'med-share',
    showLink: 'http://p025heou9.bkt.clouddn.com',
  },
    // wechat appid/secret
	wxConfig:{
		appId:'wx0ad6f23cad3621f8',
		appSecret:'0ab4b826da07608e4b54299af36c23c0'
	}
};
