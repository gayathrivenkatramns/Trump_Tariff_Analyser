"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // base industries
    await queryInterface.bulkInsert(
      "industries",
      [
        { name: "Electronics", created_at: new Date(), updated_at: new Date() },
        { name: "Automotive", created_at: new Date(), updated_at: new Date() },
        { name: "Textiles", created_at: new Date(), updated_at: new Date() },
        { name: "Steel", created_at: new Date(), updated_at: new Date() },
        { name: "Agriculture", created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );

    // find US country
    const [countries] = await queryInterface.sequelize.query(
      "SELECT id, iso_code FROM countries"
    );
    const usa = countries.find((c) => c.iso_code === "US");
    if (!usa) return;

    const [industries] = await queryInterface.sequelize.query(
      "SELECT id, name FROM industries"
    );
    const idByName = {};
    industries.forEach((i) => (idByName[i.name] = i.id));

    await queryInterface.bulkInsert(
      "industry_tax_rates",
      [
        {
          country_id: usa.id,
          industry_id: idByName["Electronics"],
          direct_tax_pct: 18.3,
          indirect_tax_pct: 20.1,
          withholding_tax_pct: 6.2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          country_id: usa.id,
          industry_id: idByName["Automotive"],
          direct_tax_pct: 15.4,
          indirect_tax_pct: 19.0,
          withholding_tax_pct: 5.1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          country_id: usa.id,
          industry_id: idByName["Textiles"],
          direct_tax_pct: 12.0,
          indirect_tax_pct: 16.8,
          withholding_tax_pct: 4.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          country_id: usa.id,
          industry_id: idByName["Steel"],
          direct_tax_pct: 18.3,
          indirect_tax_pct: 20.1,
          withholding_tax_pct: 6.2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          country_id: usa.id,
          industry_id: idByName["Agriculture"],
          direct_tax_pct: 10.5,
          indirect_tax_pct: 14.2,
          withholding_tax_pct: 3.1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("industry_tax_rates", null, {});
    await queryInterface.bulkDelete("industries", null, {});
  },
};
