from django.test import TestCase, override_settings
from django.urls import reverse
from django.core import mail

from .models import ContactMessage


@override_settings(
	EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
	DEFAULT_FROM_EMAIL='munqitshwatashinga1@gmail.com',
	CONTACT_RECIPIENT_EMAIL='munqitshwatashinga1@gmail.com',
)
class RequestQuoteEmailTest(TestCase):
	def test_request_quote_post_sends_email_and_saves_message(self):
		url = reverse('request_quote')
		data = {
			'full_name': 'Test User',
			'email': 'sender@example.com',
			'phone': '1234567890',
			'service': 'camera',
			'message': 'Please send a quote for installation.'
		}

		response = self.client.post(url, data, follow=True)

		# Should redirect back to the request_quote page and return 200 after follow
		self.assertEqual(response.status_code, 200)

		# One email should have been sent via the locmem backend
		self.assertEqual(len(mail.outbox), 1)
		sent = mail.outbox[0]
		self.assertIn('New Quote Request from Test User', sent.subject)
		# Email should be sent to the configured recipient
		self.assertEqual(sent.to, ['munqitshwatashinga1@gmail.com'])
		# And should be sent from the desired sender
		self.assertEqual(sent.from_email, 'munqitshwatashinga1@gmail.com')

		# ContactMessage should be saved in the database
		self.assertTrue(ContactMessage.objects.filter(email='sender@example.com').exists())

