git pull origin main
cp .env.example .env

docker compose build
docker compose up -d



docker compose exec -t laravel.test composer install
# may want to remove later
docker compose exec -t laravel.test php artisan db:fresh

docker compose exec -t laravel.test php artisan migrate
docker compose exec -t laravel.test php artisan db:seed
docker compose exec -t laravel.test php artisan key:generate
docker compose exec -t laravel.test php artisan optimize
docker compose exec -t laravel.test php artisan config:clear
docker compose exec -t laravel.test php artisan cache:clear
docker compose exec -t laravel.test php artisan config:cache
docker compose exec -t laravel.test php artisan route:cache
docker compose exec -t laravel.test php artisan view:cache

echo "done"
