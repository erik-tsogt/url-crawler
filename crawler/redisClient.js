const Redis = require("ioredis");
require("dotenv").config();

const client = new Redis(process.env.REDIS_URL);

client.on("connect", () => {
    console.log("Connected to Redis.");
});

client.on("error", (error) => {
    console.error("Redis Client Error: ", error.message);
});

module.exports = client;