const cheerio = require("cheerio");
const { URL } = require("url"); 

const baseUrl = "https://www.bbc.com/news";
const baseDomain = new URL(baseUrl).hostname; 

const queue = new Set([baseUrl]);
const visited = new Set();
const MAX_PAGES = 10;

async function fetchPage(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`)
        }

        return await response.text();
    } catch (error) {
        console.error(`Error fetching URL: ${url}`, error.message);
        return null;
    }
}

function extractLinks(html, currentUrl) {
    if (!html) return;

    const $ = cheerio.load(html);
    $("a").each((_, element) => {
        let link = $(element).attr("href");
        if (!link) return;
        link = link.trim();
        
        // convert relative links to absolute links
        try {
            link = new URL(link, currentUrl).href
        } catch {
            console.warn(`Invalid URL skipped: ${link}`);
            return;
        }
        // filter other domain links
        if (new URL(link).hostname === baseDomain && !visited.has(link)) {
            queue.add(link);
        }
    });
}

async function crawl(maxPages = 10) {
    while (queue.size > 0 && visited.size < maxPages) {
        const url = queue.values().next().value;
        queue.delete(url);

        if (visited.has(url)) continue;
        visited.add(url);
        console.log(`Crawling: ${url}`);

        const html = await fetchPage(url);
        if (!html) continue;
        extractLinks(html, url);
    }
    console.log(`queue size: ${queue.size}, visited size: ${visited.size}`);
    console.log(queue);
}

crawl();
