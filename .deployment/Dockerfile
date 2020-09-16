FROM ubuntu:bionic

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    dirmngr \
    lsb-release

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs npm

RUN npm install

WORKDIR /app

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
