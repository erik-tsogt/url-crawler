const cheerio = require("cheerio");
const { URL } = require("url");

function extractLinks(html, currentUrl, baseDomain) {
    const links = []; 
    if (!html) return;

    const $ = cheerio.load(html);

    $("a").each((_, element) => {
        let link = $(element).attr("href");
        if (!link) return;

        link = link.trim();
        try {
            link = new URL(link, currentUrl).href
        } catch {
            console.warn(`Invalid URL skipped: ${link}`);
            return;
        }
        if (new URL(link).hostname === baseDomain) {
            links.push(link);
        }
    });

    return links;
}
module.exports = { extractLinks };