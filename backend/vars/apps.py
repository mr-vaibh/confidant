from django.apps import AppConfig


class VarsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vars'

    def ready(self):
        import vars.signals  # noqa