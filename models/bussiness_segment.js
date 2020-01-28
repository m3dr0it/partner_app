'use strict';
module.exports = (sequelize, DataTypes) => {
  const bussiness_segment = sequelize.define('bussiness_segment', {
    bussiness_segment: DataTypes.STRING
  }, {});
  bussiness_segment.associate = function(models) {
    bussiness_segment.hasMany(models.customer);
    bussiness_segment.hasMany(models.vendor);
    // associations can be defined here
  };
  return bussiness_segment;
};