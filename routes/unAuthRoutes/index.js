const express = require("express");
const router = express.Router();

router.use("/products", require("./products"));
router.use("/sales", require("./sales"));

module.exports = router;
