/* eslint-disable fp/no-let */
const os = require('os');
const express = require('express');
const path = require('path');

const chrome = require('./chrome.js');
const cache = require('./cache.js');

const config = require('./config.json');

let browserWSEndpoint = null;

const renderer = express();
renderer.use(express.static('build', {
    index: false
}));

renderer.get('*', async (req, res) => {
    let host = `${config.APP_HOSTNAME}:${config.APP_PORT}`;
    const result = req.hostname.match(/(en|ar)-(ae|sa|kw|om|bh|qa)/);
    if (result) {
        host = `${result[0]}.${host}`;
    }

    const url = `http://${host}${req.originalUrl}`;

    try {
        // Try to get the rendered HTML of the requested URL from cache
        let { value: html, ttRenderMs } = await cache.get(url);

        // If not in cache than, render the page in a headless instance of Google Chrome
        if (!html) {
            const renderResponse = await chrome.instance(url, browserWSEndpoint);
            html = renderResponse.html;
            ttRenderMs = renderResponse.ttRenderMs;
            browserWSEndpoint = renderResponse.browserWSEndpoint;

            // Save the rendered HTML page in cache
            cache.set(url, html);
        }

        // Add Server-Timing HTTP header! See https://w3c.github.io/server-timing/.
        res.set({
            'Server-Timing': `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`,
            'Content-Security-Policy': 'script-src \'self\''
        });

        // Serve the rendered HTML
        res.status(200).send(html); // Serve prerendered page as response.
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

(async () => {
    const CACHE_OPTIONS = {
        MEMORY_CACHE_MAX_SIZE: config.MEMORY_CACHE_MAX_SIZE,
        DISK_CACHE_DIRECTORY: config.DISK_CACHE_DIRECTORY
    };
    const PORT = config.PORT || 5000;
    try {
        await cache.init(CACHE_OPTIONS);
        renderer.listen(PORT);
        console.log('Renderer started. Press Ctrl+C to quit');
    }
    catch (err) {
        console.error(err);
    }
})();
