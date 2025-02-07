const cheerio = require("cheerio");
const { URL } = require("url");

function extractLinks(html, currentUrl, baseDomain, visited) {
    const links = []; 
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
            links.push(link);
        }
    });

    return links;
}
module.exports = { extractLinks };