const express = require("express");
const router = express.Router();

router.use("/products", require("./products"));
router.use("/sales", require("./sales"));
router.use("/category", require("./category"));
router.use("/reviews", require("./reviews"));
router.use("/comments", require("./comments"));
router.use("/blogPost", require("./blogPost"));
router.use("/user",require("./user.js"));
router.use("/faq",require("./faq.js"));
router.use("/payment",require("./payment.js"));
module.exports = router;
