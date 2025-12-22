Render deployment setup

Do NOT commit secrets (passwords) into the repository. Use the Render dashboard to set the following environment variables for the `camerainstallationweb` service:

- EMAIL_HOST_USER — your Gmail address (e.g. munqitshwatashinga1@gmail.com)
- EMAIL_HOST_PASSWORD — your Gmail App Password (16-character app password). Mark this secret in the Render dashboard.
- DEFAULT_FROM_EMAIL — optional; defaults to `EMAIL_HOST_USER` if not set.
- LOG_LEVEL — e.g. `DEBUG` or `INFO`.

Steps to configure on Render:

1. Open your service in the Render dashboard.
2. Go to the "Environment" (Environment Variables) section.
3. Add the variables above. For `EMAIL_HOST_PASSWORD`, mark it as secret in the dashboard UI.
4. Deploy or trigger a new deploy.

Testing a one-off command on Render (recommended):

- Use Render's dashboard to run a one-off job / shell and run the management command with env vars already set by the service environment:

  python manage.py send_test_email

If you prefer to run locally before deploying, run these in PowerShell (set password locally only):

```powershell
$env:EMAIL_HOST_USER="munqitshwatashinga1@gmail.com"
$env:EMAIL_HOST_PASSWORD="<YOUR_16_CHAR_APP_PASSWORD>"
$env:DEFAULT_FROM_EMAIL="munqitshwatashinga1@gmail.com"
$env:LOG_LEVEL='DEBUG'
$env:TEST_EMAIL_RECIPIENT='munqitshwatashinga1@gmail.com'
.venv\Scripts\Activate.ps1
python manage.py send_test_email
```

Troubleshooting:

- If you get a Gmail authentication error, ensure you created an App Password and not your account password.
- Ensure `EMAIL_HOST_USER` matches the Gmail account used to generate the App Password.
- Check Render logs for deployment-time errors and runtime logs for mail errors.

If you want, I can draft the exact env var entries for the Render dashboard (without values) or a sample `render.yaml` snippet you can upload.

Viewing logs
------------

- Local terminal: Run the app (development) or the management command and watch stdout/stderr.
  - Example (management command):
    ```powershell
    .venv\Scripts\Activate.ps1
    $env:EMAIL_HOST_USER="munqitshwatashinga1@gmail.com"
    $env:EMAIL_HOST_PASSWORD="<YOUR_16_CHAR_APP_PASSWORD>"
    $env:DEFAULT_FROM_EMAIL="munqitshwatashinga1@gmail.com"
    $env:LOG_LEVEL=DEBUG
    python manage.py send_test_email
    ```

- Render dashboard: Deploy or run the `send-test-email` one-off job (added to `render.yaml`).
  - Open your service in the Render dashboard → Logs to see real-time stdout/stderr.
  - For the one-off job, go to the "Jobs" section and run `send-test-email`; view job logs after it finishes.

Notes
-----
- The application logging is configured to write to the console (stdout) so Render captures logs automatically.
- Do not commit `EMAIL_HOST_PASSWORD` to source control. Always set it as a secret in the Render UI.
