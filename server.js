const app=require('./app');
const http=require('http');
const mongoose = require('./db/connectDB');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const config=require('./config/config');
  var server=http.createServer(app);
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });