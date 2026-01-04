"use strict";

module.exports = (sequelize, DataTypes) => {
  const IndustryTaxRate = sequelize.define(
    "IndustryTaxRate",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      industry_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      direct_tax_pct: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      indirect_tax_pct: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      withholding_tax_pct: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
    },
    {
      tableName: "industry_tax_rates",
      underscored: true,
    }
  );

  IndustryTaxRate.associate = (models) => {
    IndustryTaxRate.belongsTo(models.Country, {
      foreignKey: "country_id",
      as: "country",
    });
    IndustryTaxRate.belongsTo(models.Industry, {
      foreignKey: "industry_id",
      as: "industry",
    });
  };

  return IndustryTaxRate;
};
