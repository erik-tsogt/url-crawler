const client = require("./redisClient");

// TEST
async function testConnection() {
    try {
        const pong = await client.ping();
        console.log("PING Response: ", pong);

        await client.set("testKey", "Hello, Redis!");
        const response = await client.get("testKey");
        console.log("Redis response value: ", response);
    } catch (error) {
        console.error("Error pinging Redis: ", error)
    } finally {
        client.quit();
    }
}

testConnection();
