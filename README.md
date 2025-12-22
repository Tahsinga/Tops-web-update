# Camera Installation Web

This project is a Django site for a camera/security installation business.

## SEO & Production Checklist

- Set `DEBUG=False` in production (use environment variable `DEBUG=False`).
- Ensure you do NOT include `<meta name="robots" content="noindex">` in production templates.
- Robots file is at `static/robots.txt` and allows crawling; update the `Sitemap:` URL if you change domains.
- Sitemap is available at `/sitemap.xml`. Add the site to Google Search Console (URL prefix), verify ownership, and submit `/sitemap.xml`.

If you'd like, I can also update templates to use a shared `base.html` to centralize the head/meta tags.
# Camera Installation Web

A Django web application for managing camera installations.

## Project Setup

### Prerequisites
- Python 3.13+
- pip

### Installation

1. **Create and activate virtual environment** (if not already done):
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

2. **Install Django**:
   ```bash
   pip install django
   ```

3. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

### Running the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

### Creating a Django App

To create a new Django app within this project:

```bash
python manage.py startapp app_name
```

Then add the app to `INSTALLED_APPS` in `camerainstallationweb/settings.py`.

### Project Structure

```
CameraInstallationWeb/
├── .venv/                          # Virtual environment
├── camerainstallationweb/          # Project configuration
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py                 # Project settings
│   ├── urls.py                     # URL routing
│   └── wsgi.py
├── manage.py                       # Django management script
└── README.md
```

## Common Commands

- `python manage.py makemigrations` - Create migrations for model changes
- `python manage.py migrate` - Apply database migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py shell` - Open Django shell
- `python manage.py test` - Run tests

## Next Steps

1. Create Django apps for your features
2. Define models in each app's `models.py`
3. Create views in each app's `views.py`
4. Configure URL routing
5. Create templates for your views

For more information, visit the [Django documentation](https://docs.djangoproject.com/).
