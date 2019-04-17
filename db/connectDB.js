const mongoose = require("mongoose");
const config = require(".././config/config");
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
