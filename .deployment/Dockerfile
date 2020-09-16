FROM ubuntu:bionic

ENV DEBIAN_FRONTEND noninteractive

RUN npm install --global grunt-cli

WORKDIR /app

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
