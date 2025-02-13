const { URL } = require("url");
const { fetchPage } = require("./fetcher");
const { extractLinks } = require("./parser");
const { baseUrl, maxPages, headers } = require("./config");
const { enqueueUrl, dequeueUrl, isVisited, markVisited } = require("./redisTaskManager");

class Crawler {
    constructor(baseUrl, maxPages) {
        this.baseUrl = baseUrl;
        this.maxPages = maxPages;
        this.baseDomain = new URL(baseUrl).hostname;
    }

    async crawl() {
        await enqueueUrl(this.baseUrl);

        let pagesCrawled = 0;
        while (pagesCrawled < this.maxPages) {
            const url = await dequeueUrl();
            if (!url) {
                console.log("Queue is empty. Crawling end.")
                break;
            }

            if (await isVisited(url)) {
                continue;
            }

            await markVisited(url);
            pagesCrawled++;
            console.log(`Crawling (${pagesCrawled}): ${url}`);

            const html = await fetchPage(url, headers);
            if (!html) continue;
            const newLinks = extractLinks(html, url, this.baseDomain);

            for (const link of newLinks) {
                if (!(await isVisited(link))) {
                    await enqueueUrl(link);
                }
            }
        }
        console.log("Crawling complete.");
    }
}
const crawler = new Crawler(baseUrl, maxPages);
crawler.crawl();