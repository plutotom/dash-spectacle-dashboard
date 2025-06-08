#!/bin/bash

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

# Ensure storage directory structure exists locally
echo "Setting up storage directory structure..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/{app/public,logs}
chmod -R 775 storage

# Build and start containers
echo "Building and starting Docker containers..."
docker compose build
docker compose up -d

# Wait for containers to be ready
echo "Waiting for containers to be ready..."
sleep 10

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until docker compose exec mysql mysqladmin ping -h"localhost" --silent; do
    echo "MySQL is unavailable - sleeping"
    sleep 5
done
echo "MySQL is ready!"

# Setup Laravel application
echo "Installing Composer dependencies..."
docker compose exec -t laravel.test composer install

echo "Setting up storage directories in container..."
docker compose exec -t laravel.test mkdir -p storage/framework/{sessions,views,cache}
docker compose exec -t laravel.test mkdir -p storage/{app/public,logs}
docker compose exec -t laravel.test chmod -R 775 storage
docker compose exec -t laravel.test chown -R www-data:www-data storage

echo "Generating application key..."
docker compose exec -t laravel.test php artisan key:generate

echo "Running database migrations..."
docker compose exec -t laravel.test php artisan migrate

echo "Seeding database..."
docker compose exec -t laravel.test php artisan db:seed

echo "Optimizing application..."
docker compose exec -t laravel.test php artisan config:clear
docker compose exec -t laravel.test php artisan cache:clear
docker compose exec -t laravel.test php artisan config:cache
docker compose exec -t laravel.test php artisan route:cache
docker compose exec -t laravel.test php artisan view:cache

# Set permissions for storage
docker compose exec -t laravel.test chmod -R 775 storage
docker compose exec -t laravel.test chown -R www-data:www-data storage

docker compose exec -t laravel.test php artisan optimize

ssh plutotom@spectral-dashboard "sudo reboot"

echo "done"
