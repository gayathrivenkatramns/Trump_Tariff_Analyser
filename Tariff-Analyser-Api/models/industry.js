"use strict";

module.exports = (sequelize, DataTypes) => {
  const Industry = sequelize.define(
    "Industry",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "industries",
      underscored: true,
    }
  );

  Industry.associate = (models) => {
    Industry.hasMany(models.IndustryTaxRate, {
      foreignKey: "industry_id",
      as: "taxRates",
    });
  };

  return Industry;
};
