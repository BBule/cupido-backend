const RazorPay = require("razorpay");
const config = require("../config/config");

const instance = new RazorPay(config.RAZOR_PAY);

/**
 * Creates the Order id against a amount.
 * [later it will be used in frontend to simulate the Ui
 * and process the payment]
 * @param {Number} amount
 * @param {String} localPaymentId
 * @param {Boolean} paymentCapture
 * @param {Object} notes
 */
const createOrder = async (
    amount,
    localPaymentId,
    paymentCapture = true,
    notes = {}
) => {
    return await instance.orders.create({
        amount,
        currency: "INR",
        receipt: localPaymentId,
        payment_capture: paymentCapture,
        notes
    });
};

module.exports = {
    createOrder
};
