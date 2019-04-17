const configs = {
    MONGO_URL:
        process.env.MONGO_URL ||
        "mongodb://getlow:lowerlowest1@ds131721.mlab.com:31721/getlow",
    GOOGLE_CLIENT_ID:
        process.env.GOOGLE_CLIENT_ID ||
        "538251364150-kg2713vshgkc3uvlqprirg47bq8s74pu.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET:
        process.env.GOOGLE_CLIENT_SECRET || "OUUSDpDbBe2C_ehka7hiis4U",
    GOOGLE_REDIRECT_URL:
        process.env.GOOGLE_REDIRECT_URL || "http://127.0.0.1:3000/login",
    msg91_AUTH_KEY: process.env.msg91_AUTH_KEY || "271701A7FBbvWdD52e5cad80c2",
    JWT_SECRET:
        process.env.JWT_SECRET ||
        "ckhkfnksnfjodjf98iehfnoic4ued8rif4398eoiurjf948iednfidns0-495-",
    ENV: process.env.NODE_ENV || "development"
};

module.exports = Object.freeze(configs);
