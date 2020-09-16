FROM ubuntu:bionic

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    dirmngr \
    lsb-release

RUN add-apt-repository -y -r ppa:chris-lea/node.js
RUN rm -f /etc/apt/sources.list.d/chris-lea-node_js-*.list

RUN echo 'deb [trusted=yes] https://deb.nodesource.com/setup_12.x xenial main' > /etc/apt/sources.list.d/nodesource.list\
 && echo 'deb-src [trusted=yes] https://deb.nodesource.com/setup_12.x xenial main' >> /etc/apt/sources.list.d/nodesource.list

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    nodejs \
    npm

RUN npm install

WORKDIR /app

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
