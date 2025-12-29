const express = require("express");
const router = express.Router();
const impactController = require("../controllers/impact_analysis.controller");

router.get("/currency", impactController.getCurrencyData);
router.get("/duty-type", impactController.getDutyTypeData);
router.get("/tariff", impactController.getTariffData);
router.post("/tariffimpact", impactController.getTariffImpactData);

module.exports = router;