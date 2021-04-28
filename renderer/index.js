/* eslint-disable fp/no-let */
const express = require('express');

const cache = require('./cache.js');
const chrome = require('./chrome.js');

const {
    PORT,
    MEMORY_CACHE_MAX_SIZE,
    DISK_CACHE_DIRECTORY,
    APP_URL_BLACKLIST,
    APP_HOSTNAME,
    APP_PORT
} = require('./renderer.config');

let browserWSEndpoint = null;

const renderer = express();

// Serve static files directly from the 'build' directory
renderer.use(express.static('build', {
    index: false
}));

renderer.get('*', async (req, res, next) => {
    let host = `${APP_HOSTNAME}:${APP_PORT}`;
    const result = req.hostname.match(/(en|ar)-(ae|sa|kw|om|bh|qa)/);
    if (result) {
        host = `${result[0]}.${host}`;
    }

    const url = `http://${host}${req.originalUrl}`;

    try {
        // Try to get the rendered HTML of the requested URL from Cache
        let { value: html, ttRenderMs = 0 } = await cache.get(url);

        // If not in Cache than, render the page in a headless instance of Google Chrome
        if (!html) {
            const CHROME_OPTIONS = {
                APP_URL_BLACKLIST
            }
            const renderResponse = await chrome.instance(url, browserWSEndpoint, CHROME_OPTIONS);
            html = renderResponse.html;
            ttRenderMs = renderResponse.ttRenderMs;
            browserWSEndpoint = renderResponse.browserWSEndpoint;

            // Save the rendered HTML page in Cache
            cache.set(url, html);
        }

        // Add Server-Timing HTTP header! See https://w3c.github.io/server-timing/.
        res.set({
            'Server-Timing': `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`,
            'Content-Security-Policy': 'script-src \'self\''
        });

        // Serve the rendered HTML
        res.status(200).send(html); // Serve prerendered page as response.
    } catch (err) {
        console.error(err);
        next(err);
    }
});

(async () => {
    const CACHE_OPTIONS = {
        MEMORY_CACHE_MAX_SIZE,
        DISK_CACHE_DIRECTORY
    };
    const PORT = PORT || 5000;
    try {
        await cache.init(CACHE_OPTIONS);
        renderer.listen(PORT);
        console.log('Renderer started. Press Ctrl+C to quit');
    } catch (err) {
        console.error(err);
    }
})();
