'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    role: DataTypes.STRING
  }, {});
  role.associate = function(models) {
    role.hasMany(models.account)
    // associations can be defined here
  };
  return role;
};