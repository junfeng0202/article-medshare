const constants = require('../../config/constants');
const HttpUtil = require('../utils/http.util');
const Model = require('../models/index');
const redisClient = require('../../config/redis')();
const redisUtil = require('../utils/redis.util');
const logger = require('../utils/log.util').getLogger('errLogger');

const qryNewsList = async (page = 1, limit = constants.NEWS_PAGE_LIMIT, condition = {}) => {
  const rtnList = {
    newsList: [],
    totalPage: 1,
    currentPage: page,
    limit,
    con: condition,
  };

  try {
    const conditions = {
      attributes: ['newsId', 'writerName', 'type', 'newsClass', 'title', 'introduction', 'createdAt'],
      offset: (page - 1) * limit,
      limit,
      order: [['createdAt', 'DESC']],
      where: {},
    };

    // console.log(condition);

    if (condition.newsClass) {
      conditions.where.newsClass = condition.newsClass;
    }
    if (condition.type) {
      conditions.where.type = condition.type;
    }
    if (condition.keywords) {
      conditions.where.$or = { title: { $like: `%${condition.keywords}%` }, writerName: { $like: `%${condition.keywords}%` } };
    }

    // console.log(conditions);
    const newsList = await Model.News.findAndCountAll(conditions);

    const totalPage = newsList.count;
    if (/*! newsList.dataValues || */totalPage === 0) {
      return rtnList;
    }

    rtnList.newsList = newsList.rows;
    rtnList.totalPage = totalPage;
    return rtnList;
  } catch (err) {
    logger.info(err);
    return rtnList;
  }
};

// 显示所有新闻列表
exports.index = (req, res, next) => {
  const mainFunction = async () => {
    try {
      // console.log(req.query);
      const page = req.query.page || 1;
      const type = req.query.type || 0;
      const newsClass = req.query.newsClass || 0;
      const keywords = req.query.keywords || '';
      const condition = {};
      if (type) {
        condition.type = type;
      }
      if (newsClass) {
        condition.newsClass = newsClass;
      }
      if (keywords) {
        condition.keywords = keywords;
      }
      const datas = await qryNewsList(page, /* 5 */constants.NEWS_PAGE_LIMIT, condition);
      datas.titles = '文章列表';
      // console.log(datas);
      res.render('news/index', datas);
      // res.render('newsIndex');
    } catch (err) {
      logger.info(err);
      // console.log(err);
      next(err);
    }
  };

  mainFunction();
};

// 按照条件模糊查询新闻
exports.findNewsList = (req, res) => {
  const httpUtil = new HttpUtil(req, res);
  const page = req.query.page || 1;
  const newsClass = req.query.newsClass || 0;
  const type = req.query.type || 0;
  const title = req.query.title || '';
  const writerName = req.query.writerName || '';

  const mainFunction = async () => {
    try {
      const conditionList = {};
      if (newsClass) {
        conditionList.newsClass = newsClass;
      }
      if (type) {
        conditionList.type = type;
      }
      if (title) {
        conditionList.title = title;
      }
      if (writerName) {
        conditionList.writerName = writerName;
      }
      const datas = await qryNewsList(page, constants.NEWS_PAGE_LIMIT, conditionList);
      httpUtil.sendJson(constants.HTTP_SUCCESS, '', datas);
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL);
    }
  };

  mainFunction();
};

// 添加文章页面
exports.add = (req, res) => {
  res.render('news/edit', { titles: '添加文章' });
};

// 查询文章的详细信息
exports.edit = (req, res, next) => {
  const newsId = req.params.newsId || 0;

  if (!newsId) {
    res.render('news/edit', {});
    return;
  }
  const mainFunction = async () => {
    try {
      const newsInfo = await Model.News.findOne({ where: { newsId } });
      // console.log(newsInfo.dataValues);
      if (!newsInfo.dataValues) {
        // throw new Error('文章不存在！');
        res.send('文章不存在！');
      }
      newsInfo.dataValues.titles = '编辑文章';
      res.render('news/edit', newsInfo.dataValues);
    } catch (err) {
      logger.info(err);
      next(err);
    }
  };
  mainFunction();
};


// 编辑/新增新闻
exports.saveData = (req, res) => {
  // console.log(req.body);
  const newsClass = req.body.newsClass || 0;
  const type = req.body.type || 0;
  const title = req.body.title || '';
  const writerName = req.body.writerName || '';
  const introduction = req.body.introduction || '';
  const imgUrl = req.body.imgUrl || '';
  const context = req.body.context || '';
  // 非空edit 空为add
  const newsId = req.body.newsId || 0;
  const httpUtil = new HttpUtil(req, res);

  if (!newsClass || !title || !writerName || !introduction /* || !context || !imgUrl */ || !type) {
    httpUtil.sendJson(constants.HTTP_FAIL, '参数错误');
    return;
  }

  const mainFunction = async () => {
    try {
      if (newsId) {
        const affectedRow = await Model.News.update({
          writerName,
          type,
          newsClass,
          title,
          introduction,
          imgUrl,
          context,
        }, { where: { newsId } });
        // console.log(11);
        // console.log(affectedRow);
        if (affectedRow[0] === 1) {
          // console.log(12);
          redisClient.hsetAsync(
            redisUtil.getRedisPrefix(11),
            newsId,
            JSON.stringify({ name: title, cat: newsClass }),
          );
          // console.log(22);
          httpUtil.sendJson(constants.HTTP_SUCCESS, '更新成功', {
            newsInfo: {
              newsId,
              writerName,
              type,
              newsClass,
              title,
              introduction,
              imgUrl,
              context,
            },
          });
        } else {
          httpUtil.sendJson(constants.HTTP_FAIL, '更新失败');
        }
      } else {
        const newsInfo = await Model.News.create({
          writerName,
          type,
          newsClass,
          title,
          introduction,
          imgUrl,
          context,
        });
        if (newsInfo.dataValues && newsInfo.dataValues.newsId) {
          // 加入热门排行榜和热门分类排行榜
          // 按照加入的时间顺序排序
          // 加入资讯缩略信息，供排行榜等显示的时候查询
          const timestamp = `0.${new Date().getTime()}`;
          const rankKey = redisUtil.getRedisPrefix(2);
          const rankTypeKey = redisUtil.getRedisPrefix(2, newsClass);
          const briefKey = redisUtil.getRedisPrefix(11);
          await redisClient.multi()
            .zadd(rankKey, timestamp, newsInfo.dataValues.newsId)
            .zadd(rankTypeKey, timestamp, newsInfo.dataValues.newsId)
            .hset(
              briefKey,
              newsInfo.dataValues.newsId,
              JSON.stringify({ name: newsInfo.title, cat: newsInfo.newsClass }),
            )
            .execAsync();

          httpUtil.sendJson(constants.HTTP_SUCCESS, '新增成功', '/news');
        } else {
          httpUtil.sendJson(constants.HTTP_FAIL, '新增失败');
        }
      }
    } catch (err) {
      logger.info(err);
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
    }
  };
  mainFunction();
};

// 删除新闻
exports.delNews = (req, res) => {
  const newsId = req.params.newsId || 0;
  const httpUtil = new HttpUtil(req, res);

  const mainFunction = async () => {
    try {
      const newsInfo = await Model.News.findOne({ where: { newsId } });
      // console.log(newsInfo);
      if (newsInfo && newsInfo.dataValues) {
        const type = parseInt(newsInfo.dataValues.type, 0);
        const newsClass = parseInt(newsInfo.dataValues.newsClass, 0);
        // 删除热门排行榜和热门分类排行榜
        const rankKey = redisUtil.getRedisPrefix(2);
        const rankTypeKey = redisUtil.getRedisPrefix(2, newsClass);

        if (type === 1) {
          // 普通资讯文章
          const affectedRows = await Model.News.destroy({ where: { newsId } });
          // console.log(affectedRows);
          if (affectedRows > 0) {
            const resData = await redisClient.multi()
              .zrem(rankKey, newsId)
              .zrem(rankTypeKey, newsId)
              .execAsync();
            if (res.length === 2) {
              resData.sendJson(constants.HTTP_SUCCESS, '删除成功');
            } else {
              logger.info(resData);
              httpUtil.sendJson(constants.HTTP_FAIL, '删除redis失败');
            }
          } else {
            httpUtil.sendJson(constants.HTTP_FAIL, '删除失败');
          }
        } else {
          // 自测题 cascade delete
          const affectedRows = await Model.News.destroy({ where: { newsId } });
          // await Model.SelfTest.destroy({ where: newsId }, { transaction });
          if (affectedRows > 0) {
            const result = await redisClient.multi()
              .zrem(rankKey, newsId)
              .zrem(rankTypeKey, newsId)
              .execAsync();
            if (result.length === 2) {
              httpUtil.sendJson(constants.HTTP_SUCCESS, '删除成功');
            } else {
              logger.info(result);
              httpUtil.sendJson(constants.HTTP_FAIL, '删除redis失败');
            }
          } else {
            // Rolled back
            httpUtil.sendJson(constants.HTTP_FAIL, '删除失败');
            // logger.info(err);
          }
        }
      } else {
        httpUtil.sendJson(constants.HTTP_SUCCESS, '该文章不存在！');
      }
    } catch (err) {
      httpUtil.sendJson(constants.HTTP_FAIL, '系统错误');
      logger.info(err);
      // console.log(err);
    }
  };
  mainFunction();
};

