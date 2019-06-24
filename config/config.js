const configs = {
    MONGO_URL:
        process.env.MONGO_URL ||
        "mongodb://getlow:lowerlowest1@ds131721.mlab.com:31721/getlow",
    GOOGLE_CLIENT_ID:
        process.env.GOOGLE_CLIENT_ID ||
        "524726124380-536q8uhh4gfic4rq2s3jepc9s2btirkj.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET:
        process.env.GOOGLE_CLIENT_SECRET || "s-G0KeQEKJ3AagIs3PYe4SoZ",
    GOOGLE_REDIRECT_URL:
        process.env.GOOGLE_REDIRECT_URL || "http://127.0.0.1:3000/login",
    JWT_SECRET:
        process.env.JWT_SECRET ||
        "ckhkfnksnfjodjf98iehfnoic4ued8rif4398eoiurjf948iednfidns0-495-",
    JWT_EXP: process.env.JWT_EXP || 604800,
    MAIL: {
        fromMail: process.env.FROM_MAIL || "info@lecupido.com",
        SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
        SMTP_PORT: process.env.SMTP_PORT || 465,
        SECURE: process.env.SECURE || true, //in case port value is 465
        SMTP_USER: process.env.SMTP_USER || "startsetteam",
        SMTP_PASS: process.env.SMTP_PASS || "astraalive"
    },
    RAZOR_PAY: {
        key_id: process.env.RAZ_KEY || "rzp_live_nasXctJT5J1Thz",
        key_secret: process.env.RAZ_SECRET || "Q8noJfieO0KwbFyejTfaP2XU"
    },
    SMS: {
        AUTH_KEY: process.env.SMS_AUTH_KEY || "271810AhUrdTw4cS5cadda21",
        SENDER_ID: process.env.SMS_SENDER_ID || "Cupido"
    },
    FRONT_HOST: process.env.FRONT_HOST || "http://localhost:3000",
    ENV: process.env.NODE_ENV || "development"
};

module.exports = Object.freeze(configs);
