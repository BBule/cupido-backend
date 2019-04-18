const express = require("express");
const router = express.Router();
const paymentCont = require("../controller/payment.cont");
/**
 * Generate OrderID before rendering the
 * Payment UI https://docs.razorpay.com/docs/checkout-form#automatic-checkout
 */
router.post("/", (req, res, next) => {
    return paymentCont
        .createOrder(59900, "1235444")
        .then(data => {
            return res.json(data);
        })
        .catch(error => {
            return next(error);
        });
});

/**
 * after payment success callback
 */
router.post("/callback", (req, res, next) => {
    console.log(req.body);
    return res.json(req.body);
});

module.exports = router;
