'use strict';
module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  account.associate = function(models) {
    account.belongsTo(models.role);
    // associations can be defined here
  };
  return account;
};