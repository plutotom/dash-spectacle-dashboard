git pull origin main

docker compose build
docker compose up -d

docker compose exec -t laravel.test composer install
docker compose exec -t laravel.test php artisan migrate
docker compose exec -t laravel.test php artisan db:seed
docker compose exec -t laravel.test artisan key:generate
docker compose exec -t laravel.test artisan optimize
docker compose exec -t laravel.test php artisan config:cache
docker compose exec -t laravel.test php artisan route:cache
docker compose exec -t laravel.test php artisan view:cache

echo "done"
