// Use require for compatibility in Node.js serverless environments
const fetch = require('node-fetch');

// The main handler function for the serverless endpoint
export default async function handler(req, res) {
    // Get the target website's URL from the query parameter
    // e.g., /api/proxy?url=https://example.com
    const { url } = req.query;

    // If the URL parameter is missing, send a 400 Bad Request error
    if (!url) {
        return res.status(400).send('Error: URL parameter is missing');
    }

    try {
        // Fetch the content from the provided URL
        const response = await fetch(url);

        // Get the raw HTML/CSS/JS content as text
        let body = await response.text();

        // Get the content type (e.g., 'text/html') to send it back correctly
        const contentType = response.headers.get('content-type') || 'text/html';

        // CRITICAL STEP: Inject a <base> tag into the <head> of the HTML.
        // This forces all relative paths (like /style.css or /image.jpg)
        // to load from the original site's domain, not from your tool's domain.
        // Without this, all styling, images, and scripts on the target site would break.
        const baseTag = `<base href="${new URL(url).origin}">`;
        body = body.replace(/(<head[^>]*>)/i, `$1${baseTag}`);

        // Send the modified HTML back to the user's browser (the iframe)
        res.setHeader('Content-Type', contentType);
        res.status(200).send(body);

    } catch (error) {
        // If anything goes wrong (e.g., invalid URL, site is down),
        // send a 500 Internal Server Error with a descriptive message.
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
}