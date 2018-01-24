const constants = require('../../config/constants');
// 获取redisKey
exports.getRedisPrefix = (type, id = '') => {
  let redisKey = '';
  switch (type) {
    case 1:
      redisKey = `${constants.REDIS_PREFIX}|rank|thumbUp|news`; // 文章点赞总排行 rank|thumbUp|news {newsId:num}
      break;
    case 2:
      redisKey = `${constants.REDIS_PREFIX}|rank|pv|news`; // 文章浏览总排行 rank|pv|news {newsId:num}
      break;
    case 13:
      redisKey = `${constants.REDIS_PREFIX}|rank|comment|news`; // 文章评论总排行 rank|comment|news {newsId:num}
      break;
    case 3:
      redisKey = `${constants.REDIS_PREFIX}|rank|news|user_share`; // 用户分享出的文章 新闻pv日排行 rank|news|user_share:uid:20171116:type {newsId:num}
      break;
    case 4:
      redisKey = `${constants.REDIS_PREFIX}|rank|news_type|user_share`; // 用户分享出的文章 新闻类别pv日排行  rank|news_type|user_share:uid:20171117 {type:pv_num}
      break;
    case 7:
      redisKey = `${constants.REDIS_PREFIX}|rank|pdt_buy|user_share`; // 用户分享的商品，商品购买日排行 rank|pdt_buy|user_share:uid:20171116:type {productId:num}
      break;
    case 8:
      redisKey = `${constants.REDIS_PREFIX}|rank|pdt_buy_type|user_share`; // 用户分享的商品，商品类别购买日排行 rank|pdt_buy_type|user_share:uid_20171116 {type:num}
      break;
    case 23:
      redisKey = `${constants.REDIS_PREFIX}|rank|pdt|user_share`; // 用户分享的商品，商品pv日排行 rank|pdt|user_share:uid:20171116:type {productId:num}
      break;
    case 24:
      redisKey = `${constants.REDIS_PREFIX}|rank|pdt_type|user_share`; // 用户分享的商品，商品pv类别日排行 rank|pdt_type|user_share:uid:20171116 {type:num}
      break;


    case 5:
      redisKey = `${constants.REDIS_PREFIX}|data|user|pv_news`; // 用户当日分享所有文章  浏览人记录  data|user|pv_news:uid:20171020 {viewerId:pv_num}
      break;
    case 9:
      redisKey = `${constants.REDIS_PREFIX}|data|user|pv_products`; // 用户当日分享所有商品 浏览人记录 data|user|pv_products:uid:20171020 {viewerId:pv_num}
      break;
    case 10:
      redisKey = `${constants.REDIS_PREFIX}|data|user|purchase_record`; // 用户当日分享所有商品，购买人买记录 data|user|purchase_record:uid:20171116 {userId:buy_times}
      break;


    case 6:
      redisKey = `${constants.REDIS_PREFIX}|data|user|commission`; // 用户佣金总额 data|user|commission {userId:num}
      break;
    case 18:
      redisKey = `${constants.REDIS_PREFIX}|data|user|bonus_points`; // 用户积分总数
      break;


    case 11:
      redisKey = `${constants.REDIS_PREFIX}|brief_rank_info|news`; // 一些排行中需要显示的精简news信息，减小mysql压力
      break;
    case 12:
      redisKey = `${constants.REDIS_PREFIX}|brief_rank_info|products`; // 一些排行中需要显示的精简product信息
      break;
    case 25:
      redisKey = `${constants.REDIS_PREFIX}|brief_rank_info|users`; // 一些排行中需要显示的精简user信息
      break;


    case 14:
      redisKey = `${constants.REDIS_PREFIX}|list|comment|news`; // 文章评论列表
      break;


    case 15:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|news`; // 某文章浏览人次、人数记录 log|pv|news:newsId {userId:pv_num}
      break;
    case 16:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|user|news`; // 某用户分享出的某文章浏览人次、人数记录 log|pv|user|news:newsId:uid:20171020 {viewerId:pv_num}
      break;
    case 17:
      redisKey = `${constants.REDIS_PREFIX}|log|thumbUp|news`; // 某文章点赞人次、人数记录
      break;
    case 19:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|products`; // 某商品浏览人次、人数记录 log|pv|products:productId {userId:pv_num}
      break;
    case 20:
      redisKey = `${constants.REDIS_PREFIX}|log|pv|user|products`; // 某用户分享出的某商品浏览人次、人数记录 log|pv|user|products:pid:uid:20171020 {viewerId:pv_num}
      break;
    case 21:
      redisKey = `${constants.REDIS_PREFIX}|log|transmit|news`; // 某文章转发人次、人数记录 log|transmit|news:newsId {userId:num}
      break;
    case 22:
      redisKey = `${constants.REDIS_PREFIX}|log|transmit|user|news`; // 某用户分享出的某文章转发人次、人数 log|transmit|user|news:newsId:uid:20171020 {uid:_num}
      break;


    case 996:
      redisKey = `${constants.REDIS_PREFIX}|weChat|qrcode_ticket`; // wechat全局存储用户生成临时二维码的ticket
      break;
    case 997:
      redisKey = `${constants.REDIS_PREFIX}|weChat|basic_token`; // wechat全局存储获得基础信息token
      break;
    case 998:
      redisKey = `${constants.REDIS_PREFIX}|weChat|jsapi_ticket`; // wechat全局存储jsapi_ticket
      break;
    case 999:
      redisKey = `${constants.REDIS_PREFIX}|weChat|snap_token`; // wechat全局存储授权token
      break;


    case 1111:
      redisKey = 'sum|user|bonus_points'; // 所有项目的积分总数
      break;
    default:
      break;
  }

  return !id ? redisKey : `${redisKey}:${id}`;
};

