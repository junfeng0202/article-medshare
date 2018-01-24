module.exports = function (sequelize, DataTypes) {
  const Manager = sequelize.define('Manager', {
    managerId: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true,
    },
    account: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    // 账号类型  1:超级管理员 2:普通运营管理人员 3.开发人员
    type: { type: DataTypes.INTEGER },
  }, {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'manager',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return Manager;
};
