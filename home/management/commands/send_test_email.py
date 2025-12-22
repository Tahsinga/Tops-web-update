from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import EmailMessage, send_mail
import os
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Send a test email using current email settings (useful for Render one-off jobs)'

    def add_arguments(self, parser):
        parser.add_argument('--recipient', '-r', help='Override recipient email', required=False)

    def handle(self, *args, **options):
        recipient = options.get('recipient') or os.environ.get('TEST_EMAIL_RECIPIENT') or getattr(settings, 'CONTACT_RECIPIENT_EMAIL', None)
        if not recipient:
            self.stderr.write('No recipient configured. Set TEST_EMAIL_RECIPIENT env var or pass --recipient.')
            return

        subject = 'Render: Test Email from TOPS SYSTEMS'
        body = 'This is a test email sent to verify SMTP configuration on Render.'
        # Use configured default sender. Do not fall back to a generic no-reply address
        # because external SMTP providers (e.g. Gmail) require the FROM to be a valid
        # authenticated address.
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or settings.EMAIL_HOST_USER

        if not from_email:
            self.stderr.write('EMAIL_HOST_USER or DEFAULT_FROM_EMAIL is not configured.\n'
                              'Set EMAIL_HOST_USER and EMAIL_HOST_PASSWORD environment variables (use a Gmail App Password).')
            return

        # Print non-sensitive SMTP debug info to help troubleshooting
        smtp_info = {
            'host': getattr(settings, 'EMAIL_HOST', None),
            'port': getattr(settings, 'EMAIL_PORT', None),
            'use_tls': getattr(settings, 'EMAIL_USE_TLS', None),
            'use_ssl': getattr(settings, 'EMAIL_USE_SSL', None),
            'user_set': bool(getattr(settings, 'EMAIL_HOST_USER', None)),
        }
        self.stdout.write('SMTP config: ' + str(smtp_info))
        try:
            # Try send_mail first (simple)
            sent = send_mail(subject, body, from_email, [recipient], fail_silently=False)
            logger.info('send_mail returned: %s', sent)
            self.stdout.write(self.style.SUCCESS(f'Test email sent (send_mail returned {sent}) to {recipient}'))
        except Exception as exc:
            logger.exception('send_mail failed: %s', exc)
            # Fallback to EmailMessage for more control
            try:
                msg = EmailMessage(subject=subject, body=body, from_email=from_email, to=[recipient])
                msg.send(fail_silently=False)
                self.stdout.write(self.style.SUCCESS(f'Test email sent with EmailMessage to {recipient}'))
            except Exception as exc2:
                logger.exception('EmailMessage send failed: %s', exc2)
                self.stderr.write('Failed to send test email. Check SMTP credentials and LOGS for details.')
                raise
