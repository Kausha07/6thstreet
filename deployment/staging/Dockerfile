FROM node:lts-alpine

ENV NODE_ENV=development \
    SERVER_PORT=3000

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm i npm -g; \
    npm install; \
    sed -i 's/GENERATE_SOURCEMAP: false/GENERATE_SOURCEMAP: true/g' app/node_modules/@scandipwa/scandipwa-scripts/bin/scandipwa-scripts.js; \
    npm install --g lerna; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build; \
    npm run image-opt; \
    npm install -g @sentry/cli --unsafe-perm; \
    sentry-cli login --auth-token 4881bcdf97b043e3bddf35fde23cfec8b958e9a09dfa46349dd1de3a3abc9345; \
    sentry-cli releases new staging-map --org 6thstreet-eq; \
    sentry-cli releases files staging-map upload-sourcemaps /app/build/static/js/*.map --org 6thstreet-eq --project pwa-dev


EXPOSE 3000
CMD ["node", "app.js"]

