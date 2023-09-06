FROM node:lts-alpine

ENV NODE_ENV=development \
    SERVER_PORT=3000

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm i npm -g npm@6.14.8; \
    npm install; \
    npm install --g lerna; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build-ar

EXPOSE 3000
CMD ["node", "app.js"]
