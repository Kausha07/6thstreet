const puppeteer = require('puppeteer');
const { minify } = require('html-minifier');

// For Bots render as if on Google Pixel 2 for mobile first approach
const pixel2 = puppeteer.devices['Pixel 2'];

const instance = async (url, browserWSEndpoint) => {
    // Don't load Analytics libraries.
    const blacklist = [
        'www.google-analytics.com',
        '/gtag/js',
        'ga.js',
        'gtm.js',
        'analytics.js',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'apparel.oriserve.com',
        'sentry.io',
        /\.(ttf|tiff|woff|woff2)$/i
    ];

    // Take a note of the current time
    const start = Date.now();

    // 1. If an instance of Chrome is already running, then use it, otherwise open a new instance
    let browser = null;
    if (browserWSEndpoint) {
        browser = await puppeteer.connect({ browserWSEndpoint });
    } else {
        browser = await puppeteer.launch({
            devtools: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // <- this one doesn't works in Windows
                '--disable-gpu',
                '--disable-gl-drawing-for-tests'
            ]
        });
        browserWSEndpoint = await browser.wsEndpoint();
    }

    // 2. Open a new page/tab in the browser
    const page = await browser.newPage();

    // Emulate Google's Pixel 2 device, we will be showing mobile version of our website to crawlers
    await page.emulate(pixel2);

    // 3. Intercept network requests and abort the blacklisted requests.
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (blacklist.find((regex) => req.url().match(regex))) {
            return req.abort();
        }

        return req.continue();
    });

    // 4. Try visiting the URL
    try {
        // networkidle0 waits for the network to be idle (no requests for 500ms).
        await page.goto(url, { waitUntil: 'networkidle0' });
    } catch (err) {
        console.error(err);
        await page.close();
        throw new Error(`page.goto/waitForSelector for url ${url} timed out.`);
    }

    // 5. Execute the following JavaScript in the opened tab and save the output in the constant'html'. The output is a string which contains the rendered website's HTML code
    const html = (await page.evaluate(() => document.documentElement.outerHTML));

    // Subtract the time noted at the earlier with the current time in order to compute the time taken to render the URL
    const ttRenderMs = Date.now() - start;
    console.info(`Headless rendered page in: ${ttRenderMs}ms`);

    // Close the opened tab
    await page.close();

    // Minify the rendered HTML string and return it with the computed time to render and a connection to the browser
    return {
        html: minify(html, {
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }),
        ttRenderMs,
        browserWSEndpoint
    };
};

module.exports = { instance };
