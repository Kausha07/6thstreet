FROM node:lts-alpine

ENV NODE_ENV=staging \
    SERVER_PORT=80

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm i npm -g; \
    npm install; \
    npm rebuild node-sass

CMD ["npm", "run", "start"]
