git pull origin main
# Instead of direct copy, we'll use a safer env file update approach
if [ ! -f .env ]; then
    cp .env.example .env
else
    # Read .env.example and update .env while preserving existing values
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^# ]] || [ -z "$key" ] && continue

        # Check if the key exists in .env
        if ! grep -q "^${key}=" .env; then
            # If key doesn't exist, append it
            echo "${key}=${value}" >> .env
        fi
    done < .env.example
fi

docker compose build
docker compose up -d

docker compose exec -t laravel.test composer install
# docker compose exec -t laravel.test php artisan migrate:fresh --seed
docker compose exec -t laravel.test php artisan migrate
docker compose exec -t laravel.test php artisan db:seed
docker compose exec -t laravel.test php artisan key:generate
docker compose exec -t laravel.test php artisan optimize
docker compose exec -t laravel.test php artisan config:clear
docker compose exec -t laravel.test php artisan cache:clear
docker compose exec -t laravel.test php artisan config:cache
docker compose exec -t laravel.test php artisan route:cache
docker compose exec -t laravel.test php artisan view:cache

# Create storage link and set permissions
docker compose exec -t laravel.test php artisan storage:link
docker compose exec -t laravel.test chmod -R 775 storage
docker compose exec -t laravel.test chmod -R 775 public/storage
docker compose exec -t laravel.test chown -R www-data:www-data storage
docker compose exec -t laravel.test chown -R www-data:www-data public/storage

ssh plutotom@spectral-dashboard "sudo reboot"

echo "done"
