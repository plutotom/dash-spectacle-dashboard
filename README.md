to start do

composer install

sail up -d
sail composer install
sail pnpm install
sail pnpm dev

make sureenv has
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

## Production

make sure to run `cp .env.example .env`
then run

```

# Build and start containers
cp example.env .env
docker compose up -d --build

# Install dependencies
docker compose exec laravel.test composer install --no-dev
docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test php artisan config:cache
docker compose exec laravel.test php artisan route:cache
docker compose exec laravel.test php artisan view:cache


```
