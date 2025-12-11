'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Country.init({
    country_name: DataTypes.STRING,
    iso_code: DataTypes.STRING,
    currency: DataTypes.STRING,
    region: DataTypes.STRING,
    status: DataTypes.STRING,
    eligibility_criteria: DataTypes.STRING,
    tariff_data_status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};