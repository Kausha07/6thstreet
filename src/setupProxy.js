const proxy = require('http-proxy-middleware');

// Proxy to locale-prefixed M2 instance
const magentoLocaleRouter = (request) => {
    const { originalUrl } = request;
    const locale = /\/graphql\/([a-z]{2}-[a-z]{2})/.exec(originalUrl)[1];
    return `https://${ locale }.${ process.env.REACT_APP_MAGENTO_HOST }/`;
};

// Redirect from /graphql/en-us to a /graphql
const magentoPathRewrite = (path) => (
    path.replace(/\/graphql\/[a-z]{2}-[a-z]{2}/, '/graphql')
);

module.exports = (app) => {
    // Proxy CDN (bypass CORS)
    app.use(
        '/cdn',
        proxy({
            target: process.env.REACT_APP_CDN_API_URL,
            changeOrigin: true,
            pathRewrite: {
                '/cdn/': '/'
            }
        })
    );

    // Proxy Mobile API (bypass CORS)
    app.use(
        '/api',
        proxy({
            target: process.env.REACT_APP_MOBILEAPI_URL,
            changeOrigin: true,
            pathRewrite: {
                '/api/': '/'
            }
        })
    );

    // Proxy Magento 2 (bypass CORS)
    app.use(
        '/graphql',
        proxy({
            target: `https://${ process.env.REACT_APP_MAGENTO_HOST }/`,
            router: magentoLocaleRouter,
            pathRewrite: magentoPathRewrite,
            changeOrigin: true
        })
    );
};
