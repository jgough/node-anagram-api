FROM phusion/baseimage:0.9.18

ENV DEBIAN_FRONTEND noninteractive

RUN add-apt-repository ppa:chris-lea/node.js && apt-get update && apt-get -y upgrade
RUN apt-get install -y nodejs

RUN mkdir /app

RUN npm install -g gulp

WORKDIR /app
ADD package.json package.json
ADD gulpfile.js gulpfile.js
RUN npm install

EXPOSE 3000