#Zoo arks web service run update

composer install

php artisan migrate --force
php artisan storage:link
php artisan cache:clear
php artisan view:clear
php artisan route:clear

chmod -R 775 storage
chmod -R 775 bootstrap/cache

rm -rf storage/framework/cache/data/*
rm -rf storage/framework/sessions/*
rm -rf storage/framework/views/*
rm -rf bootstrap/cache/*.php

composer dump-auto

echo "Cleaning up"
rm -rf "%CACHE_PATH%/%CI_PIPELINE_ID%"
pwd
echo "Update and deploy successful"