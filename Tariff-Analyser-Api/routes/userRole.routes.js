const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userRole.controller");

router.post("/", ctrl.create);
router.get("/", ctrl.findAll);
router.get("/:id", ctrl.findOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
