const redis = require('redis');
const bluebird = require('bluebird');
const config = require('./config');
const logger = require('../app/utils/log.util').getLogger('errLogger');

// 目前: 管理后台至操作4库，其他的库不要使用了
// 客户端session记录在0库
// 客户端业务数据记录(除了积分和佣金总额)在4库  这里的用处主要是在增加资讯的时候加入热门排行榜
// 客户端微信信息的token存在2库
// 客户端积分和佣金总额在3库
module.exports = function () {
  const redisConfig = config.redisConfig || { host: '127.0.0.1', port: '6379' };

  const client = redis.createClient(redisConfig);

  bluebird.promisifyAll(redis.RedisClient.prototype);

  bluebird.promisifyAll(redis.Multi.prototype);

  client.on('error', (err) => {
    logger.error(`Error: ${err}`);
  });

  return client;
};
