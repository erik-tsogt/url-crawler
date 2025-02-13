const redisClient = require("./redisClient");

async function enqueueUrl(url) {
    try {
        await redisClient.lpush("urlQueue", url);
        console.log(`Enqueued: ${url}`)
    } catch (error) {
        console.error("Error Enqueueing URL: ", error.message);
    }
}

async function dequeueUrl() {
    try {
        const removedUrl = await redisClient.rpop("urlQueue");
        return removedUrl;
    } catch (error) {
        console.error("Error Dequeueing URL: ", error.message);
        return null;
    }
}

async function isVisited(url) {
    const result = await redisClient.sismember("visitedUrls", url);
    return result === 1;
}

async function markVisited(url) {
    await redisClient.sadd("visitedUrls", url);
}

module.exports = {
    enqueueUrl,
    dequeueUrl,
    isVisited,
    markVisited,
};