module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    // 用户唯一id  目前直接用微信返回的unionId
    userId: {
      type: DataTypes.STRING, primaryKey: true, unique: true,
    },
    openId: { type: DataTypes.STRING },
    userName: { type: DataTypes.STRING },
    sex: { type: DataTypes.INTEGER },
    province: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    headImgUrl: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING(11), validate: { len: 11, is: /^1[3578]\d{9}$/ } },
    // 备注字段 万一有人用同一个手机号绑定了N个微信号，可以在备注栏备注、区分一下
    remark: { type: DataTypes.STRING },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'user',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return User;
};
