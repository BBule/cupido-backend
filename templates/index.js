const promotionals = {
    sale_about_end: require("./promotional/sale_about_end"),
    sale_is_live: require("./promotional/sale_is_live"),
    sale_reminder_for_liked: require("./promotional/sale_reminder_for_liked")
};
const transationals = {
    gift_card_generated: require("./transational/gift_card_generated"),
    missed_commit: require("./transational/missed_commit"),
    order_delivered: require("./transational/order_delivered"),
    order_shipped: require("./transational/order_shipped"),
    pay_full_sellBuffer_start: require("./transational/pay_full_sellBuffer_start"),
    pay_full_sellBuffer_end: require("./transational/pay_full_sellBuffer_end"),
    payment_success: require("./transational/payment_success"),
    thanks_commiting: require("./transational/thanks_commiting")
};
module.exports = { promotionals, transationals };
