// migrations/XXXXXXXXXXXXXX-create-country.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      iso_code: {
        type: Sequelize.STRING(2),
        allowNull: false,
        unique: true,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      region: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      column2_status: {
        type: Sequelize.ENUM('Applied', 'Not Applied'),
        defaultValue: 'Not Applied',
      },
      fta_eligibility: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tariff_data_status: {
        type: Sequelize.ENUM('Complete', 'Incomplete'),
        defaultValue: 'Incomplete',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('countries');
  },
};
