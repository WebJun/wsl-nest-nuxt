FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

RUN echo 'root:docker123' | chpasswd
RUN sed -i 's@archive.ubuntu.com@mirror.kakao.com@g' /etc/apt/sources.list
RUN apt update && \
    apt install -y --no-install-recommends sudo software-properties-common \
    vim curl

WORKDIR /back.test
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN apt update && \
    apt install -y nodejs
RUN npm install -g npm@9.6.6
RUN npm install -g yarn
RUN npm install -g @nestjs/cli@9.3.0

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

RUN adduser --disabled-password --gecos "" scv

USER scv

RUN umask 022

ENTRYPOINT bash
