FROM php:8.4.13-apache-trixie

WORKDIR /usr/local/bin

COPY --from=composer:2.8.12 /usr/bin/composer /usr/local/bin/composer

COPY build/scripts/atlas.sh ./atlas

RUN set -eux; \
	chmod +x ./atlas;

WORKDIR /etc/apache2

COPY build/apache/ports.conf ./ports.conf

WORKDIR /etc/apache2/sites-available

COPY build/apache/000-default.conf ./000-default.conf

RUN set -eux; \
	apt-get update && apt-get install -y \
		libpq-dev \
		libzip-dev \
		unzip \
		; \
	docker-php-ext-install pdo_pgsql pgsql zip; \
	rm -rf /var/lib/apt/lists/*; \
	a2enmod rewrite;

WORKDIR /var/www/html

COPY src/ ./

RUN set -eux; \
	composer install --no-dev --optimize-autoloader; \
	chown -R www-data:www-data .;

EXPOSE 8080/tcp

CMD ["atlas", "application"]
