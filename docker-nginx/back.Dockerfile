FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

RUN echo 'root:docker123' | chpasswd
RUN sed -i 's@archive.ubuntu.com@mirror.kakao.com@g' /etc/apt/sources.list
RUN apt-get update && \
    apt-get install -y --no-install-recommends software-properties-common
RUN add-apt-repository ppa:ondrej/php -y
RUN apt-get update && \
    apt-get install -y --no-install-recommends sudo sudo ca-certificates \
    wget curl openssh-server vim git nginx \
    php7.4-fpm php7.4-curl php7.4-xml php7.4-zip php7.4-mysql \
    php7.4-bcmath php7.4-ctype php7.4-mbstring php7.4-pdo php7.4-tokenizer
RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config

# 컴포저 설치
RUN php -r "readfile('https://getcomposer.org/installer');" | php -- --install-dir=/usr/local/bin/
RUN ln -s /usr/local/bin/composer.phar /usr/local/bin/composer

WORKDIR /home/back.test

RUN adduser --disabled-password --gecos "" scv

ENTRYPOINT service ssh start && service php7.4-fpm stop && service php7.4-fpm start && service nginx start && bash
