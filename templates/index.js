const promotionals = {
    "sale_about_end.ejs": require("./promotional/sale_about_end"),
    "sale_is_live.ejs": require("./promotional/sale_is_live"),
    "sale_reminder_for_liked.ejs": require("./promotional/sale_reminder_for_liked")
};
const transationals = {
    "gift_card.ejs": require("./transational/gift_card"),
    "missed_commit.ejs": require("./transational/missed_commit"),
    "order_delivered.ejs": require("./transational/order_delivered"),
    "order_shipped.ejs": require("./transational/order_shipped"),
    "pay_full_sellBuffer_start.ejs": require("./transational/pay_full_sellBuffer_start"),
    "pay_full_sellBuffer_end.ejs": require("./transational/pay_full_sellBuffer_end"),
    "payment_success.ejs": require("./transational/payment_success"),
    "thanks_committing.ejs": require("./transational/thanks_commiting"),
    "order_place.ejs": require("./transational/order_placed"),
    "email_verification.ejs": require("./transational/email_verification")
};
module.exports = { promotionals, transationals };
