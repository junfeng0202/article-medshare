module.exports = {
  // server config
  serverConfig: {
    serverPort: 8086,
    serverHost: 'http://localhost',
    sessionSecret: 'xsm_development_secret',
  },
  // mysql config
  mysqlConfig: {
    host: '127.0.0.1',
    port: 3306,
    database: 'virus_source_app',
    username: 'root',
    password: 'root',
  },
  // redis config
  redisConfig: {
    host: '127.0.0.1',
    port: '6379',
    db: 4,
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
};
