FROM php:8.4-fpm-trixie

WORKDIR /usr/local/bin

COPY --from=composer:2.8.12 /usr/bin/composer /usr/local/bin/composer

RUN set -eux; \
	apt-get update && apt-get install -y \
		libpq-dev \
		libzip-dev \
		unzip \
		; \
	docker-php-ext-install -j "$(nproc)" pdo_pgsql pgsql zip pcntl; \
	rm -rf /var/lib/apt/lists/*;

WORKDIR /var/www/html

COPY src/ ./

RUN set -eux; \
    mv -f .env.compose .env; \
	composer install --no-dev --optimize-autoloader; \
	chown -R www-data:www-data .;

CMD ["php-fpm"]
