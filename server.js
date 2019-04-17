const app = require("./app");
const http = require("http");
require("./db/connectDB");
const port = parseInt(process.env.PORT, 10) || 3000;
var server = http.createServer(app);
server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});
