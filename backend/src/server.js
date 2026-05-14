require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const initSocket = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

const start = async () => {
    await connectDB();
    await connectRedis();
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

start();