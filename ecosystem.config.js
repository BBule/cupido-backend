module.exports = {
    apps: [
        {
            name: "prod_cupido",
            script: "server.js",
            instances: 1,
            autorestart: true,
            watch: true,
            env: {
                NODE_ENV: "development",
                PORT: 3001,
                MONGO_URL:
                    "mongodb://getlow:lowerlowest1@ds131721.mlab.com:31721/getlow",
                GOOGLE_CLIENT_ID:
                    "524726124380-536q8uhh4gfic4rq2s3jepc9s2btirkj.apps.googleusercontent.com",
                GOOGLE_CLIENT_SECRET: "s-G0KeQEKJ3AagIs3PYe4SoZ",
                GOOGLE_REDIRECT_URL: "https://dev.lecupido.com/login",
                FRONT_HOST: "https://dev.lecupido.com"
            },
            env_production: {
		PORT: 3002,
                NODE_ENV: "production",
                MONGO_URL:
                    "mongodb://localhost:27000/cupido_backend",
                GOOGLE_CLIENT_ID:
                    "524726124380-536q8uhh4gfic4rq2s3jepc9s2btirkj.apps.googleusercontent.com",
                GOOGLE_CLIENT_SECRET: "s-G0KeQEKJ3AagIs3PYe4SoZ",
                GOOGLE_REDIRECT_URL: "https://web.lecupido.com/login",
                FRONT_HOST: "https://web.lecupido.com"
            }
        }
    ]
};
