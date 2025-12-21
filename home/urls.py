from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('services/', views.services, name='services'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('starlink/', views.starlink, name='starlink'),
    path('access_control/', views.access_control, name='access_control'),
    path('cctv/', views.cctv, name='cctv'),
    path('electric_fence/', views.electric_fence, name='electric_fence'),
    path('gate_automation/', views.gate_automation, name='gate_automation'),
    path('mantrap/', views.mantrap, name='mantrap'),
    path('vehicle_tracking/', views.vehicle_tracking, name='vehicle_tracking'),
    path('video_audio_intercom/', views.video_audio_intercom, name='video_audio_intercom'),
    path('request-quote/', views.request_quote, name='request_quote'),
    path('open-template/<str:filename>/', views.open_template, name='open_template'),
]
