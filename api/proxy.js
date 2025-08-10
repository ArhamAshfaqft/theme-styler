// We need to use 'node-fetch' to make requests on the server
import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Get the target URL from the query string
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Error: URL parameter is missing');
    }

    try {
        const response = await fetch(url);
        let body = await response.text();
        const contentType = response.headers.get('content-type') || 'text/html';

        // VERY IMPORTANT: This rewrites relative URLs (like /style.css) to absolute URLs.
        // Without this, the target site's CSS and images would not load.
        const baseTag = `<base href="${new URL(url).origin}">`;
        body = body.replace(/(<head[^>]*>)/i, `$1${baseTag}`);

        // Set headers to allow display and send the content back
        res.setHeader('Content-Type', contentType);
        res.status(200).send(body);

    } catch (error) {
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
}