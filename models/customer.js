'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    no:DataTypes.INTEGER,
    name: DataTypes.STRING,
    register_date: DataTypes.DATE,
    address: DataTypes.STRING,
    phone_number: DataTypes.BIGINT,
    contact_name: DataTypes.STRING,
    contact_number: DataTypes.BIGINT,
    contact_email: DataTypes.STRING,
    contact_position: DataTypes.STRING
  }, {});
  customer.associate = function(models) {
    customer.belongsTo(models.countries);
    customer.belongsTo(models.bussiness_segment);
    customer.belongsTo(models.origin_of_opportunity);
    // associations can be defined here
  };
  return customer;
};