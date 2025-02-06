const axios = require("axios");
//const cheerio = require("cheerio");
const targetUrl = "https://stackoverflow.com/questions";

const fetchPage = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(`Error fetching ${url}`, err.message);
        return null;
    }
}

fetchPage(targetUrl).then((html) => {
    if (html) console.log(html.substring(0, 500));
})

