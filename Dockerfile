FROM php:8.4.13-apache-trixie

WORKDIR /usr/local/bin

COPY build/scripts/atlas.sh ./atlas

RUN set -eux; \
	chmod +x ./atlas;

WORKDIR /etc/apache2

COPY build/apache/ports.conf ./ports.conf

WORKDIR /etc/apache2/sites-available

COPY build/apache/000-default.conf ./000-default.conf

RUN set -eux; \
	apt-get update && apt-get install -y \
		curl \
		libpq-dev \
		libzip-dev \
		unzip \
		; \
	docker-php-ext-install pdo_pgsql pgsql zip; \
	php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; \
	php composer-setup.php --install-dir=/usr/local/bin --filename=composer; \
	rm composer-setup.php; \
	rm -rf /var/lib/apt/lists/*; \
	a2enmod rewrite;

WORKDIR /var/www/html

COPY src/ ./

RUN set -eux; \
	composer install --no-dev --optimize-autoloader; \
	chown -R www-data:www-data .;

EXPOSE 8080/tcp

CMD ["atlas", "application"]
