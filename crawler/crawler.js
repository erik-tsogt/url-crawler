const axios = require("axios");
const cheerio = require("cheerio");
const targetUrl = "https://stackoverflow.com/questions";

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

async function main() {
    const html = await fetchPage(targetUrl);
    if (html) {
        const links = extractLinks(html);
        console.log(`Found ${links.length} links`);
        console.log(`Extracted links:\n${links.join("\n")}`);
    }
}

main()
