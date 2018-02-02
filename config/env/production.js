module.exports = {
  // server config
  serverConfig: {
    serverPort: 80,
    serverHost: 'http://article.medsci-tech.com',
    sessionSecret: 'xsm_production_secret',
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
    host: 'r-2zebafe77a6fd114.redis.rds.aliyuncs.com',
    port: '6379',
    db: 4,
    password: 'xuLU5900',
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
  wechatConfig:{
      appId: 'wxe64196a2b2a34571',
      appSecret: '3d0085937747e85d2fcb0b1399a6e64b',
      Token: 'easywechat',
  }
};
