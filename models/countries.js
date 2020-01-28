'use strict';
module.exports = (sequelize, DataTypes) => {
  const countries = sequelize.define('countries', {
    country: DataTypes.STRING,
    country_code : DataTypes.STRING
  },{});
  countries.associate = function(models){
    countries.hasMany(models.customer)
    countries.hasMany(models.vendor)
    // associations can be defined here
  };
  return countries;
};