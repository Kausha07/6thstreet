FROM node:lts-alpine

ENV NODE_ENV=development \
    SERVER_PORT=3000

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm install --g lerna

RUN npm i npm -g; \
    npm install; \
    sed -i 's/GENERATE_SOURCEMAP: false/GENERATE_SOURCEMAP: true/g' /app/node_modules/@scandipwa/scandipwa-scripts/bin/scandipwa-scripts.js; \
    npm install --g lerna; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build-ar; \
    npm run image-opt

EXPOSE 3000
CMD ["node", "app.js"]
