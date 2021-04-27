/* eslint-disable fp/no-let */
const os = require('os');
const express = require('express');
const path = require('path');

const chrome = require('./chrome.js');
const cache = require('./cache.js');

let browserWSEndpoint = null;

const renderer = express();
renderer.use(express.static('build', {
    index: false
}));

renderer.get('*', async (req, res) => {
    let host = 'localhost:3000';
    const result = req.hostname.match(/(en|ar)-(ae|sa|kw|om|bh|qa)/);
    if (result) {
        host = `${result[0]}.${host}`;
    }

    // Try to get the rendered HTML of the requested URL from cache
    let { html, ttRenderMs } = await cache.get(req.originalUrl);

    // If not in cache than, render the page in a headless instance of Google Chrome
    if (!html) {
        const renderResponse = await chrome.instance(`http://${host}${req.originalUrl}`, browserWSEndpoint);
        html = renderResponse.html;
        ttRenderMs = renderResponse.ttRenderMs;
        browserWSEndpoint = renderResponse.browserWSEndpoint;
        // Save the rendered HTML page in cache
        cache.set(req.originalUrl, html);
    }

    // Add Server-Timing HTTP header! See https://w3c.github.io/server-timing/.
    res.set({
        'Server-Timing': `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`,
        'Content-Security-Policy': 'script-src \'self\''
    });

    // Serve the rendered HTML
    res.status(200).send(html); // Serve prerendered page as response.
});

cache.init(
    path.resolve(os.tmpdir(), '6thstreet')
).then(() => new Promise((resolve, reject) => {
    renderer.listen(5000, (err) => {
        if (err) {
            reject(err);
        }
        resolve();
    });
})).then(() => {
    console.log('Renderer started. Press Ctrl+C to quit');
}).catch((err) => {
    console.error(err);
});
