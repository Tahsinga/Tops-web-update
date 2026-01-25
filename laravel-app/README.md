Laravel scaffold (placeholder)

This folder is a scaffold for a Laravel project. To finish setup on your machine:

1. Install PHP (>=8.0) and Composer.
2. From this folder run:

```bash
composer install
php artisan key:generate
php artisan serve
```

3. Visit http://127.0.0.1:8000/

Notes:
- The `artisan` file is a placeholder until Composer dependencies are installed.
- If you prefer, create a fresh Laravel project with `composer create-project --prefer-dist laravel/laravel .` and then copy `public/static/` and `resources/views/` into it.
