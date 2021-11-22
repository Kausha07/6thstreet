require('dotenv-flow').config();
const express = require('express');
var serveStatic = require('serve-static')
const serverTimings = require('server-timings');
const proxy = require('./src/setupProxy');
const path = require('path');

const PORT = 3000;
const app = express();
function setCustomCacheControl (res, path) {
    res.append('Access-Control-Allow-Origin', ['*']);
    if (serveStatic.mime.lookup(path) === 'text/html') {
      // Custom Cache-Control for HTML files
      res.setHeader('Cache-Control', 'public, max-age=0')
      
      CDN_URL = process.env?.PUBLIC_URL || '';
      S3_CDN_URL = process.env?.REACT_APP_CDN_API_URL || '';
      if(CDN_URL || S3_CDN_URL){
        res.setHeader('link', `<${CDN_URL}>; rel=preconnect, <${S3_CDN_URL}>; rel=preconnect`);
      }
    
    }
    else {
        res.append('cache-control', 'public, max-age=259200, must-revalidate');
    }
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
