const Redis = require("ioredis");
require("dotenv").config();

const client = new Redis({
    url: process.env.REDIS_URL, 
    token: process.env.TOKEN
});

client.on("connect", () => {
    console.log("Connected to Redis.");
});

client.on("error", (error) => {
    console.error("Redis Client Error: ", error.message);
});

module.exports = client;