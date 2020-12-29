FROM node:lts-alpine as build

ENV NODE_ENV=production \
    SERVER_PORT=80

RUN apk add libsass --update-cache; \
    mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm i npm -g; \
    npm install; \
    npm install --g lerna; \
    npm install --g forever; \
    lerna bootstrap; \
    npm rebuild node-sass; \
    npm run build


FROM nginx:1.17.8-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["forever", "start", "app.js"]