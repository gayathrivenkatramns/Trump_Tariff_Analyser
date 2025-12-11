// models/country.js
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    country_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    iso_code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    column2_status: {
      type: DataTypes.ENUM('Applied', 'Not Applied'),
      defaultValue: 'Not Applied',
    },
    fta_eligibility: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tariff_data_status: {
      type: DataTypes.ENUM('Complete', 'Incomplete'),
      defaultValue: 'Incomplete',
    },
  }, {
    tableName: 'countries',
    underscored: true,   // so created_at/updated_at match
    timestamps: true,
  });

  return Country;
};
