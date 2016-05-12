FROM phusion/baseimage:0.9.18

ENV DEBIAN_FRONTEND noninteractive

RUN add-apt-repository ppa:chris-lea/node.js && apt-get update && apt-get -y upgrade
RUN apt-get install -y nodejs

RUN mkdir /src

RUN npm install -g gulp

WORKDIR /src
ADD src/package.json /src/package.json
ADD src/gulpfile.js /src/gulpfile.js
RUN npm install

EXPOSE 3000