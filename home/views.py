from django.shortcuts import render
import logging
import os
import datetime
from django.http import HttpResponse, Http404
from django.shortcuts import redirect, render
from django.contrib import messages
from .forms import ContactForm
from django.conf import settings
from django.core.mail import send_mail
from .models import ContactMessage, QuoteMessage

logger = logging.getLogger(__name__)

def home(request):
    logger.info("Homepage loaded by user")
    context = {
        'title': 'TOPS Systems - Camera Installation & Starlink Setup',
        'slides': [
            {
                'image': 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&fit=crop&q=80',
                'title': 'Professional Camera Installation',
                'description': 'HD Surveillance Solutions for Your Property'
            },
            {
                'image': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80',
                'title': 'Starlink Network Setup',
                'description': 'High-Speed Satellite Internet Connectivity'
            },
            {
                'image': 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08e?w=1200&h=600&fit=crop&q=80',
                'title': 'Smart Security Systems',
                'description': '24/7 Monitoring and Real-Time Alerts'
            },
            {
                'image': 'https://images.unsplash.com/photo-1560264357-8d9766a14e6d?w=1200&h=600&fit=crop&q=80',
                'title': 'Network Integration',
                'description': 'Seamless Connectivity Solutions'
            },
            {
                'image': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop&q=80',
                'title': 'Commercial Security',
                'description': 'Enterprise-Grade Protection Services'
            },
            {
                'image': 'https://images.unsplash.com/photo-1516321318423-f06f70674c48?w=1200&h=600&fit=crop&q=80',
                'title': 'Advanced Monitoring',
                'description': 'Real-Time Analytics and Insights'
            },
        ],
        'services': [
            {'icon': '📹', 'title': 'Camera Installation', 'description': 'Professional CCTV and IP camera setup for homes and businesses'},
            {'icon': '🛰️', 'title': 'Starlink Setup', 'description': 'Complete Starlink installation and network configuration'},
            {'icon': '🔒', 'title': 'Security Systems', 'description': 'Comprehensive security solutions with monitoring'},
            {'icon': '🌐', 'title': 'Network Integration', 'description': 'Seamless integration of cameras with network systems'},
            {'icon': '🏠', 'title': 'Residential Solutions', 'description': 'Home security and internet installation packages'},
            {'icon': '🏢', 'title': 'Commercial Solutions', 'description': 'Business-grade security and networking'},
        ],
        'projects': [
            {'name': 'Office Building', 'type': 'Camera System', 'image': 'project1.jpg'},
            {'name': 'Retail Store', 'type': 'Security Setup', 'image': 'project2.jpg'},
            {'name': 'Residential Home', 'type': 'Complete Package', 'image': 'project3.jpg'},
            {'name': 'Warehouse', 'type': 'Monitoring System', 'image': 'project4.jpg'},
        ]
    }
    return render(request, 'home/index.html', context)

def services(request):
    return render(request, 'home/services.html', {'title': 'Our Services'})

def about(request):
    return render(request, 'home/about.html', {'title': 'About Us'})

def contact(request):
    # contact page with a simple contact form that sends an email
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            message_text = form.cleaned_data['message']

            subject = 'New Contact Message'
            timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            body = (
                f"NEW CONTACT MESSAGE RECEIVED\n"
                f"=============================\n\n"
                f"CUSTOMER DETAILS:\n"
                f"----------------\n"
                f"Email Address: {email}\n\n"
                f"MESSAGE:\n"
                f"--------\n"
                f"{message_text}\n\n"
                f"---\n"
                f"This message was submitted via the TOPS SYSTEMS website contact form.\n"
                f"Please respond to the customer's email: {email}\n"
                f"Timestamp: {timestamp}"
            )

            recipient = getattr(settings, 'CONTACT_RECIPIENT_EMAIL', 'munqitshwatashinga1@gmail.com')
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'munqitshwatashinga1@gmail.com')

            try:
                result = send_mail(
                    subject,
                    body,
                    from_email,
                    [recipient],
                    fail_silently=False
                )
                # Save to database
                ContactMessage.objects.create(email=email, message=message_text)
                messages.success(request, 'Message sent successfully!')
                logger.info('Contact form sent by %s', email)
            except Exception as exc:
                logger.exception('Failed to send contact email: %s', exc)
                messages.error(request, 'Failed to send message. Please try again later.')

            return redirect('contact')
    else:
        form = ContactForm()

    return render(request, 'home/contact.html', {'title': 'Contact Us', 'form': form})

def starlink(request):
    return render(request, 'home/starlink.html', {'title': 'Starlink Services'})

def access_control(request):
    return render(request, 'home/access_control.html', {'title': 'Access Control Services'})

def cctv(request):
    return render(request, 'home/cctv.html', {'title': 'CCTV Services'})

def electric_fence(request):
    return render(request, 'home/electric_fence.html', {'title': 'Electric Fence Services'})

def gate_automation(request):
    return render(request, 'home/gate_automation.html', {'title': 'Gate Automation Services'})

def mantrap(request):
    return render(request, 'home/mantrap.html', {'title': 'Mantrap Services'})

def vehicle_tracking(request):
    return render(request, 'home/vehicle_tracking.html', {'title': 'Vehicle Tracking Services'})

def video_audio_intercom(request):
    return render(request, 'home/video_audio_intercom.html', {'title': 'Video & Audio Intercom Services'})


def open_template(request, filename):
    """Safely return the raw template source for files under templates/home/ as plain text.

    This is intentionally simple and restricted: it rejects path separators and '..'.
    """
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates', 'home')
    # basic validation to prevent directory traversal
    if any(part in filename for part in ('..', '/', '\\')):
        raise Http404("Not found")

    file_path = os.path.join(templates_dir, filename)
    file_path = os.path.abspath(file_path)
    if not file_path.startswith(os.path.abspath(templates_dir) + os.sep):
        raise Http404("Not found")

    if not os.path.exists(file_path):
        raise Http404("Not found")

    with open(file_path, 'r', encoding='utf-8') as fh:
        content = fh.read()

    return HttpResponse(content, content_type='text/plain')


def request_quote(request):
    """Handle quote request form POST and send an email to test address."""
    if request.method != 'POST':
        return redirect('home')

    name = request.POST.get('full_name', 'No name')
    email = request.POST.get('email', 'no-reply@example.com')
    phone = request.POST.get('phone', 'N/A')
    service_value = request.POST.get('service', 'General Enquiry')
    message = request.POST.get('message', '')

    # Map service values to user-friendly names
    service_mapping = {
        'camera': 'Camera Installation',
        'starlink': 'Starlink Setup',
        'security': 'Security System',
        'network': 'Network Integration',
        'CCTV': 'CCTV System',
        '': 'General Enquiry'
    }
    service = service_mapping.get(service_value, service_value)

    subject = f"Quote Request: {service} from {name}"
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    body = (
        f"NEW QUOTE REQUEST RECEIVED\n"
        f"==========================\n\n"
        f"CUSTOMER DETAILS:\n"
        f"----------------\n"
        f"Full Name: {name}\n"
        f"Email Address: {email}\n"
        f"Phone Number: {phone}\n"
        f"Requested Service: {service}\n\n"
        f"PROJECT DESCRIPTION:\n"
        f"-------------------\n"
        f"{message}\n\n"
        f"---\n"
        f"This quote request was submitted via the TOPS SYSTEMS website.\n"
        f"Please respond to the customer's email: {email}\n"
        f"Timestamp: {timestamp}"
    )

    # Recipient for testing (corrected)
    recipient = 'munqitshwatashinga1@gmail.com'

    # Determine from email
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'munqitshwatashinga1@gmail.com')

    email_sent = False
    try:
        result = send_mail(
            subject,
            body,
            from_email,
            [recipient],
            fail_silently=False
        )
        # Save to database
        QuoteMessage.objects.create(
            full_name=name,
            email=email,
            phone=phone,
            service=service,
            message=message
        )
        email_sent = True
        logger.info('Quote email sent to %s', recipient)
    except Exception as exc:
        logger.exception('Failed to send quote email: %s', exc)

    return render(request, 'home/quote_sent.html', {'title': 'Request Sent', 'name': name, 'email_sent': email_sent})
