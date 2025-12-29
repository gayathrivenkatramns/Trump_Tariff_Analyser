'use strict';

module.exports = {
  User: (sequelize, DataTypes) => {
    return sequelize.define("User", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: "user" },
    });
  },

  Country: (sequelize, DataTypes) => {
    return sequelize.define("Country", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      country: DataTypes.STRING,
      currency: DataTypes.STRING,
    });
  },

  Currency: (sequelize, DataTypes) => {
    return sequelize.define("Currency", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      country: DataTypes.STRING,
      currency: DataTypes.STRING,
    });
  },

  DutyType: (sequelize, DataTypes) => {
    return sequelize.define("DutyType", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      duty_type: DataTypes.STRING,
    });
  },

  TariffDataset: (sequelize, DataTypes) => {
    return sequelize.define("TariffDataset", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      hs_code: DataTypes.STRING,
      product: DataTypes.STRING,
      tariff_rate: DataTypes.STRING,
      year: DataTypes.INTEGER,
      country: DataTypes.STRING,
    });
  },

  ImpactAnalysis: (sequelize, DataTypes) => {
    return sequelize.define(
      "ImpactAnalysis",
      {
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        key: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: "impact_analysis",
        timestamps: true,
      }
    );
  },
};