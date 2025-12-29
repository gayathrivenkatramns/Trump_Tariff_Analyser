// controllers/impact_analysis.controller.js
const path = require("path");
const XLSX = require("xlsx");

// Helper to load Excel and convert to JSON
function loadExcel(fileName) {
  const filePath = path.join(__dirname, "..", "pipeline", "parsed", fileName);
  console.log("Trying to read file from:", filePath);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

// shared helper for tariff sheet
function getTariffRows() {
  return loadExcel("tariff_dataset_500_rows.xlsx");
}

module.exports = {
  // GET /api/impact-analysis/currency
  getCurrencyData: (req, res) => {
    try {
      const data = loadExcel("currency.xlsx");
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/impact-analysis/duty-type
  getDutyTypeData: (req, res) => {
    try {
      const data = loadExcel("duty_type.xlsx");
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // GET /api/impact-analysis/tariff
  getTariffData: (req, res) => {
    try {
      const data = getTariffRows();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // POST /api/impact-analysis/tariffimpact
  getTariffImpactData: (req, res) => {
    try {
      const {
        minTaxRate = 0,
        maxTaxRate = 100,
        year,
        productCategoryId,
        subcategoryId,
        originCountryCode,
        destinationCountryCode,
      } = req.body;

      const allTariffs = getTariffRows(); // all rows from tariff_dataset_500_rows.xlsx

      // 1) filter rows using inputs and min/max tax rate
      const filtered = allTariffs.filter((r) => {
        const dutyRate = Number(
          r["Duty Rate"] || r["duty rate"] || r["duty_rate"] || 0
        );

        if (year && Number(r["Year"]) !== Number(year)) return false;
        if (productCategoryId && r["Product Category"] !== productCategoryId)
          return false;
        if (subcategoryId && r["Subcategory"] !== subcategoryId) return false;
        if (originCountryCode && r["Origin Country"] !== originCountryCode)
          return false;
        if (
          destinationCountryCode &&
          r["Destination Country"] !== destinationCountryCode
        )
          return false;

        if (dutyRate < Number(minTaxRate)) return false;
        if (dutyRate > Number(maxTaxRate)) return false;

        return true;
      });

      // nothing matched -> empty chart
      if (!filtered.length) {
        return res.json({ barChart: [], pieChart: [], summary: null });
      }

      // 2) take one row and treat duty rate as tariffRate
      const row = filtered[0];
      const dutyRate = Number(
        row["Duty Rate"] || row["duty rate"] || row["duty_rate"] || 0
      );

      const shipmentValue = 100000; // base shipment value for cost calculation

      // tariffRate = dutyRate, with simple multipliers for different periods
      const preTrumpRate = dutyRate * 0.5;
      const trumpRate = dutyRate * 1.0;
      const currentRate = dutyRate * 0.8;

      // 3) additionalCost = shipmentValue * tariffRate / 100
      const barChart = [
        {
          period: "Pre-Trump",
          tariffRate: preTrumpRate,
          additionalCost: (shipmentValue * preTrumpRate) / 100,
        },
        {
          period: "Trump Era",
          tariffRate: trumpRate,
          additionalCost: (shipmentValue * trumpRate) / 100,
        },
        {
          period: "Current",
          tariffRate: currentRate,
          additionalCost: (shipmentValue * currentRate) / 100,
        },
      ];

      // 4) pie + summary from Trump‑era duty
      const baseTariff = (shipmentValue * trumpRate) / 100;
      const antiDumping = baseTariff * 0.3;
      const countervailing = baseTariff * 0.2;
      const section301 = baseTariff * 0.36;
      const totalDutyCost =
        baseTariff + antiDumping + countervailing + section301;

      const pieChart = [
        { name: "Base Tariff", value: baseTariff },
        { name: "Anti-Dumping Duty", value: antiDumping },
        { name: "Countervailing Duty", value: countervailing },
        { name: "Section 301 Tariff", value: section301 },
      ];

      const summary = {
        baseTariff,
        antiDumping,
        countervailing,
        section301,
        totalDutyCost,
      };

      return res.json({ barChart, pieChart, summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};