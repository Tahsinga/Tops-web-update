from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'weekly'

    def items(self):
        # Add the named URL patterns for important static pages
        return ['home', 'services', 'contact']

    def location(self, item):
        return reverse(item)
