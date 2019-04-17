const moment = require("moment");
const { SendMail, getEJSTemplate } = require("../helpers/mailHelper");

/**
 * Invoke only on delivery with details
 */
const sendMailOnDelivery = async (user, products) => {
    const ejsTemplate = await getEJSTemplate({
        fileName: "order_delivered.ejs"
    });
    const finalHTML = ejsTemplate({
        time: moment().format("lll"),
        username: user.name,
        productArr: products //may be format properly before passing it
    });
    const message = {
        to: user.email,
        subject: "Delivered: Your Cupido package has been delivered.",
        body: finalHTML
    };
    return await SendMail(message);
};


/**
 * Invoke only when product shipped with details
 */
const sendMailOnShipped = (user,shippingDetails) => {
    const ejsTemplate = await getEJSTemplate({
        fileName: "order_shipped.ejs"
    });
    const finalHTML = ejsTemplate({
        time: moment().format("lll"),
        username: user.name,
        shippingDetails: shippingDetails //may be format properly before passing it
    });
    const message = {
        to: user.email,
        subject: "Order Shipped: Your Cupido package has been Shipped.",
        body: finalHTML
    };
    return await SendMail(message);
};


/**
 * Invoke only on Payment success with details
 */
const paymentSuccess = (user,paymentDetails) => {
    const ejsTemplate = await getEJSTemplate({
        fileName: "payment_success.ejs"
    });
    const finalHTML = ejsTemplate({
        time: moment().format("lll"),
        username: user.name,
        paymentDetails: paymentDetails //may be format properly before passing it
    });
    const message = {
        to: user.email,
        subject: "Your payment in cupido was a success!",
        body: finalHTML
    };
    return await SendMail(message);

};


/**
 * Invoke only on commiting with details
 */
const thanksForCommit = (user,commitDetails) => {
    const ejsTemplate = await getEJSTemplate({
        fileName: "thanks_committing.ejs"
    });
    const finalHTML = ejsTemplate({
        time: moment().format("lll"),
        username: user.name,
        commitDetails: commitDetails //may be format properly before passing it
    });
    const message = {
        to: user.email,
        subject: "Thanks for commiting!",
        body: finalHTML
    };
    return await SendMail(message);
};

module.exports = {
    sendMailOnDelivery,
    sendMailOnShipped,
    paymentSuccess,
    thanksForCommit
};
