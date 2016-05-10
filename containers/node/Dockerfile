FROM phusion/baseimage:0.9.18

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get -y upgrade
RUN add-apt-repository ppa:chris-lea/node.js && apt-get update
RUN apt-get install -y nodejs python make g++

RUN mkdir /src

RUN npm install gulp -g
RUN npm install gulp-download -g
RUN npm install express-generator -g
RUN npm install heapdump

WORKDIR /src
ADD package.json /src/package.json
RUN npm install

EXPOSE 3000