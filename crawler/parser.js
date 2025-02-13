const cheerio = require("cheerio");
const { URL } = require("url");

function extractLinks(html, currentUrl, baseDomain) {
    if (!html) return new Set();

    const $ = cheerio.load(html);
    const links = new Set();

    $("a").each((_, element) => {
        let link = $(element).attr("href");
        if (!link) return;

        link = link.trim();
        try {
            const absoluteUrl = new URL(link, currentUrl).href;
            if (new URL(absoluteUrl).hostname === baseDomain) {
                links.add(absoluteUrl);
            }
        } catch {
            console.warn(`Invalid URL skipped: ${link}`);
            return;
        }
    });

    return links;
}
module.exports = { extractLinks };