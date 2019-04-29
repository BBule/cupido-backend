const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const app = require("./app");

require("./db/connectDB");

// if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         console.log(
//             `worker ${
//                 worker.process.pid
//             } died with signal ${signal} and code ${code}`
//         );
//     });
// } else {
// Workers can share any TCP connection
// In this case it is an HTTP server
const port = parseInt(process.env.PORT, 10) || 3001;
var server = http.createServer(app);
server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});

console.log(`Worker ${process.pid} started`);
// }
