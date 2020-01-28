'use strict';
module.exports = (sequelize, DataTypes) => {
  const origin_of_opportunity = sequelize.define('origin_of_opportunity', {
    origin_of_opportunity: DataTypes.STRING
  }, {});
  origin_of_opportunity.associate = function(models) {
    origin_of_opportunity.hasMany(models.customer)
    origin_of_opportunity.hasMany(models.vendor)
    // associations can be defined here
  };
  return origin_of_opportunity;
};