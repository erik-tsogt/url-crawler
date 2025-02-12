const { URL } = require("url");
const { fetchPage } = require("./fetcher");
const { extractLinks } = require("./parser");
const { redisClient } = require("./redisClient");
const { baseUrl, maxPages, headers } = require("./config");

async function enqueueUrl(url) {
    try {
        await redisClient.rpush("urlQueue", url);
    } catch (error) {
        console.error("Error Enqueueing URL: ", error.message);
    }
}

async function dequeueUrl() {
    try {
        const removedUrl = await redisClient.lpop("urlQueue");
        return removedUrl;
    } catch (error) {
        console.error("Error Dequeueing URL: ", error.message);
        return null;
    }
}

class Crawler {
    constructor(baseUrl, maxPages) {
        this.baseUrl = baseUrl;
        this.baseDomain = new URL(baseUrl).hostname;
        this.maxPages = maxPages;
        this.queue = new Set([baseUrl]);
        this.visited = new Set();
    }

    async crawl() {
        while (this.queue.size > 0 && this.visited.size < this.maxPages) {
            const url = this.queue.values().next().value;
            this.queue.delete(url);
    
            if (this.visited.has(url)) continue;
            this.visited.add(url);
            console.log(`Crawling: ${url}`);
    
            const html = await fetchPage(url, headers);
            if (!html) continue;
            
            const newLinks = extractLinks(html, url, this.baseDomain, this.visited);
            newLinks.forEach((link) => this.queue.add(link));
        }
        console.log(`Crawl complete! \n queue size: ${this.queue.size}, visited size: ${this.visited.size}`);
        console.log("------------------------------------------");
        console.log(this.queue);
    }
}

const crawler = new Crawler(baseUrl, maxPages);
crawler.crawl();