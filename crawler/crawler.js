const axios = require("axios");
const cheerio = require("cheerio");
const targetUrl = "https://stackoverflow.com/questions";
const MAX_DEPTH = 20;


let queue = new Set(); 
let visited = new Set();

async function fetchPage(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(`Error fetching ${url}`, err.message);
        return null;
    }
}

function extractLinks(html) {
    const $ = cheerio.load(html) // Load the HTML content
    let links = [];

    $("a").each((index, element) => {
        const link = $(element).attr("href");
        if (link && link.startsWith("http")) {
            links.push(link);
        }
    })
    return links;
}

async function crawl(startUrl, maxPages = MAX_DEPTH) {
    queue.add(startUrl);

    while (queue.size > 0 && visited.size < maxPages) {
        const url = queue.values().next().value;
        queue.delete(url);
        visited.add(url);

        console.log(`Crawling: ${url}`);
        const html = await fetchPage(url);
        if (!html) continue;

        const links = extractLinks(html);
        links.forEach((link) => {
            if (!visited.has(link) && !queue.has(link)) {
                queue.add(link);
            }
        });
        console.log(`queue size: ${queue.size}, visited size: ${visited.size}`);
        console.log(`Found ${links.length} links.`);
    }
    console.log("Crawling complete!");
}

// Start the crawler
crawl(targetUrl, 10);
