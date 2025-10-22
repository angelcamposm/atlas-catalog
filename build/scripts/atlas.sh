#!/usr/bin/env bash

case "$1" in
  application)
    apache2-foreground
    ;;
  scheduler)
    php artisan schedule:work
    ;;
  worker)
    php artisan queue:work --sleep=3 --tries=3
    ;;
  *)
    echo "Usage: $0 {application|scheduler|worker}"
    exit 1
    ;;
esac

exit 0
