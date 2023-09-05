FROM node:lts-alpine as build

ENV NODE_ENV=production \
    SERVER_PORT=3000

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app
WORKDIR /app
RUN npm i npm -g npm@9.8.1; \
    npm install; \
    npm install --g lerna; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build

EXPOSE 3000
CMD ["node", "app.js"]