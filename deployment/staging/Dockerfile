FROM node:lts-alpine

ENV NODE_ENV=development \
    SERVER_PORT=80

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm i npm -g; \
    npm install; \
    npm install --g lerna; \
    npm install --g serve; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build

CMD ["npm", "run", "prod"]
