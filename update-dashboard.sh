#!/bin/bash

# Get current user and group IDs
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

# Export these for docker-compose
export WWWUSER=$CURRENT_UID
export WWWGROUP=$CURRENT_GID

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

echo "Setting proper permissions for storage..."
sudo chown -R $CURRENT_UID:$CURRENT_GID storage
sudo chmod -R 775 storage
sudo chown -R $CURRENT_UID:$CURRENT_GID bootstrap/cache
sudo chmod -R 775 bootstrap/cache

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
docker compose exec -t laravel.test chown -R $CURRENT_UID:$CURRENT_GID storage

# Ensure public/storage symlink exists (create or fix if missing/broken)
echo "Ensuring public/storage symlink exists..."
# docker compose exec -t laravel.test bash -lc 'if [ ! -L public/storage ] || [ ! -e public/storage ]; then echo "Creating storage symlink..."; rm -rf public/storage; php artisan storage:link; else echo "public/storage symlink already exists."; fi'
cd /Users/proctoi/Documents/Coding/dash-spectacle-dashboard
ROOT="$(pwd)"
if [ ! -L "$ROOT/public/storage" ] || [ ! -e "$ROOT/public/storage" ]; then
  rm -rf "$ROOT/public/storage"
  ln -s "$ROOT/storage/app/public" "$ROOT/public/storage"
  echo "Created $ROOT/public/storage -> $ROOT/storage/app/public"
else
  echo "$ROOT/public/storage symlink already exists"
fi

# echo "Generating application key..."
# docker compose exec -t laravel.test php artisan key:generate

echo "Running database migrations..."
docker compose exec -t laravel.test php artisan migrate

# echo "Seeding database..."
# docker compose exec -t laravel.test php artisan db:seed

echo "Setting permissions for storage..."
docker compose exec -t laravel.test chmod -R 775 storage
docker compose exec -t laravel.test chown -R $CURRENT_UID:$CURRENT_GID storage

echo "Optimizing application..."
docker compose exec -t laravel.test php artisan optimize:clear
docker compose exec -t laravel.test php artisan optimize

# After docker compose up -d
echo "Setting up storage permissions..."
docker compose exec -t laravel.test bash -c "chown -R $CURRENT_UID:$CURRENT_GID storage bootstrap/cache && chmod -R 775 storage bootstrap/cache"

# Wait for containers to be healthy
# echo "Waiting for containers to be ready..."
# docker compose exec -t laravel.test php artisan --version

# #Test espresso components (only if environment is properly configured)
# echo "Testing espresso components..."
# if docker compose exec -t laravel.test php artisan espresso:test-components --component=all 2>/dev/null; then
#     echo "✅ Espresso components test completed successfully"
# else
#     echo "⚠️ Espresso components test failed - this is expected if environment variables are not configured"
#     echo "To configure espresso functionality, add the following to your .env file:"
#     echo "  GAGGIUINO_URL=http://gaggiuino.local"
#     echo "  HOMEASSISTANT_URL=http://your-ha-instance:8123"
#     echo "  HOMEASSISTANT_TOKEN=your_long_lived_access_token"
#     echo "  HOMEASSISTANT_ESPRESSO_MACHINE_ENTITY_ID=switch.your_espresso_machine"
# fi

# # Optional: Test the scheduling command (only if environment is properly configured)
# echo "Testing espresso scheduling..."
# if docker compose exec -t laravel.test php artisan espresso:schedule-processing 2>/dev/null; then
#     echo "✅ Espresso scheduling test completed successfully"
# else
#     echo "⚠️ Espresso scheduling test failed - this is expected if environment variables are not configured"
# fi

ssh plutotom@spectral-dashboard "sudo reboot"

echo "done"
