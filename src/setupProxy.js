const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    // Proxy CDN (bypass CORS)
    app.use(
        '/cdn',
        proxy({
            target: process.env.REACT_APP_CDN_API_HOST,
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
            target: process.env.REACT_APP_MOBILEAPI_HOST,
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
            target: process.env.REACT_APP_MAGENTO_HOST,
            changeOrigin: true
        })
    );
};
