'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('countries', [
      {
        country_name: 'Belarus',
        iso_code: 'BY',
        currency: 'BYN',
        region: 'Europe',
        column2_status: 'Applied',
        fta_eligibility: null,
        tariff_data_status: 'Incomplete',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // ...convert ALL remaining INSERT rows to objects like this
      // last example:
      {
        country_name: 'Zambia',
        iso_code: 'ZM',
        currency: 'ZMW',
        region: 'Africa',
        column2_status: 'Not Applied',
        fta_eligibility: 'A*',
        tariff_data_status: 'Incomplete',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('countries', null, {});
  },
};
