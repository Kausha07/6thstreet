require('dotenv-flow').config();
const express = require('express');
var serveStatic = require('serve-static')
const serverTimings = require('server-timings');
const proxy = require('./src/setupProxy');
const path = require('path');

const PORT = 3000;
const app = express();
function setCustomCacheControl(res, path) {
    res.append('Access-Control-Allow-Origin', ['*']);
    if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
    }

    else {
        res.append('cache-control', 'public, max-age=259200, must-revalidate');
    }
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-XSS-Protection", "1; mode=block;")
    res.setHeader("Strict-Transport-Security", "max-age=15768000; includeSubDomains")

}
app.use(serverTimings);
proxy(app);

// Serve the static files from the React app
app.use(serveStatic(path.join(__dirname, 'build'), {
    setHeaders: setCustomCacheControl
}))

// app.use(express.static(path.join(__dirname, 'build')));
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/build/index.html`));
});
app.listen(PORT, () => {
    console.log('Application started. Press Ctrl+C to quit');
});
app.disable('x-powered-by');
