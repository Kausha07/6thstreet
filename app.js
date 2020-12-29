require('dotenv-flow').config();
const express = require('express');
const proxy = require('./src/setupProxy');
const path = require('path');

const PORT = 3000;
const app = express();

proxy(app);
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.listen(PORT, () => {
    console.log('Application started. Press Ctrl+C to quit');
});
