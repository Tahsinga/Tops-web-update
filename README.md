# Tops Systems Website with CMS

A professional website for Tops Systems with a built-in Content Management System (CMS) that allows admin users to edit content that is visible to all visitors.

## Features

- **Admin Login**: Secure admin access with username/password
- **Live Content Editing**: Edit text and images directly on the website
- **Multi-User Support**: Changes are visible to all website visitors
- **Image Upload**: Upload new images that are stored on the server
- **Content Persistence**: All changes are saved to the server and persist across sessions
- **Reset Functionality**: Admin can reset all changes to restore original content

## Setup Instructions

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 3. Access the Website

Open your browser and go to: `http://localhost:3001`

## Admin Access

- **Username**: `admin`
- **Password**: `tops123`

## How to Use

1. **Login**: Click the "Admin" button in the navigation and login with the credentials above
2. **Edit Text**: Click the ✏️ button next to any text element to edit it
3. **Edit Images**: Click the 🖼️ button next to any image to upload a new one
4. **Save Changes**: Click "💾 Save" for text or "✔️ Upload" for images
5. **Reset**: Use the "Reset All Changes" button to restore original content

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Data Storage**: JSON file-based storage in `/data/content.json`
- **Image Storage**: Uploaded images stored in `/static/uploads/`
- **API Endpoints**:
  - `GET /api/content` - Get all saved content
  - `POST /api/content/text` - Save text content
  - `POST /api/content/image` - Save image content
  - `POST /api/upload` - Upload image files
  - `POST /api/reset` - Reset all content

## File Structure

```
/
├── index.html          # Main website
├── server.js           # Backend server
├── package.json        # Node.js dependencies
├── data/               # Content storage
│   └── content.json    # Saved content data
└── static/
    ├── css/            # Stylesheets
    ├── images/         # Original images
    └── uploads/        # User-uploaded images
```

## Security Notes

- Admin credentials are hardcoded for simplicity
- In production, implement proper authentication
- Consider adding rate limiting and input validation
- The server currently allows CORS for development

## Deployment

For production deployment:

1. Set up a proper web server (nginx, Apache)
2. Use environment variables for configuration
3. Implement proper authentication
4. Add HTTPS
5. Set up proper file permissions for the data directory

## Troubleshooting

- **Changes not saving**: Check server console for error messages
- **Images not loading**: Ensure the `/static/uploads/` directory exists and is writable
- **Server not starting**: Make sure port 3001 is available
- **CORS errors**: The server includes CORS headers for development

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
