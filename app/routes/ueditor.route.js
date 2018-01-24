const ueditor = require('ueditor');
const qn = require('qn');
const config = require('../../config/config');

module.exports = function (app) {
  // ueditor图片上传
  app.use('/ueditor/ue', ueditor('', (req, res) => {
    const client = qn.create(config.qiNiuConfig);
    let foo;
    let filePath;
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
      foo = req.ueditor.file; // 文件内容
      // console.log(req);
      // var fileFormat = (req.ueditor.filename).split(".");
      const imgname = req.ueditor.filename;

      filePath = `/images/ueditor/${Date.now()}${imgname}`;
      // res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
      // res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
    }
    //  客户端发起图片列表请求
    /* else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }  */
    else if (req.query.action === 'uploadvideo') {
      foo = req.ueditor.file; // 文件内容
      // console.log(foo);
      filePath = `/videos/ueditor/${Date.now()}${req.ueditor.filename}`;
    }
    // 客户端发起其它请求
    else {
      // console.log('config.json')
      res.setHeader('Content-Type', 'application/json');
      res.redirect('/ueditor/php/config.json');
      return;
    }
    client.upload(foo, {
      key: filePath,
    }, (err) => {
      if (err) throw err;
      res.json({
        url: filePath,
        // 'title': req.body.pictitle,
        original: filePath,
        state: 'SUCCESS',
      });
    });
  }));
};
