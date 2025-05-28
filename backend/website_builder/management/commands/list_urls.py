from django.core.management.base import BaseCommand
from django.urls import get_resolver

class Command(BaseCommand):
    help = 'List all registered URL patterns.'

    def handle(self, *args, **options):
        resolver = get_resolver()
        for pattern in resolver.url_patterns:
            self.stdout.write(str(pattern)) 