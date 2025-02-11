async function fetchPage(url, headers) {
    try {
        const response = await fetch(url, {headers});
        if (!response.ok) {
            throw new Error(`HTTP Error. Status: ${response.status}`)
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching URL: ${url}`, error.message);
        return null;
    }
}

module.exports = { fetchPage };