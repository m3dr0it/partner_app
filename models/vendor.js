'use strict';
module.exports = (sequelize, DataTypes) => {
  const vendor = sequelize.define('vendor', {
    no: DataTypes.INTEGER,
    name: DataTypes.STRING,
    register_date: DataTypes.DATE,
    service_type: DataTypes.STRING,
    address: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.BIGINT,
    contact_name: DataTypes.STRING,
    contact_number: DataTypes.BIGINT,
    contact_email: DataTypes.STRING,
    contact_position: DataTypes.STRING
  }, {});
  vendor.associate = function(models) {
    vendor.belongsTo(models.bussiness_segment)
    vendor.belongsTo(models.origin_of_opportunity)
    vendor.belongsTo(models.countries)
    // associations can be defined here
  };
  return vendor;
};