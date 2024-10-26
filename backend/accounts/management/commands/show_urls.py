# accounts/management/commands/show_urls.py

from django.core.management.base import BaseCommand
from django.urls import get_resolver

class Command(BaseCommand):
    help = 'List all URLs in the project'

    def handle(self, *args, **kwargs):
        url_patterns = get_resolver().url_patterns
        self.print_urls(url_patterns)

    def print_urls(self, patterns, base=''):
        for pattern in patterns:
            if hasattr(pattern, 'url_patterns'):
                # If it's an include, recurse into it
                self.print_urls(pattern.url_patterns, base + str(pattern.pattern))
            else:
                # It's a simple path
                self.stdout.write(base + str(pattern.pattern))
