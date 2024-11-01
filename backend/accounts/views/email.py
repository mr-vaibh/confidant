'''
The scope of this file is to override the default email templates provided by djoser.
It adds the host and port to the context data of the email templates.
'''

from confidant.settings import FRONTEND_PORT
from djoser.email import PasswordResetEmail, ActivationEmail
from rest_framework import exceptions

class BaseCustomEmail:
    def get_context_data(self):
        context = super().get_context_data()
        
        request = self.request
        if request is None:
            raise exceptions.ValidationError("Request context is required.")

        # Get the host and port from the request
        host = request.get_host().split(":")[0]
        port = f":{FRONTEND_PORT}" if FRONTEND_PORT else ""

        context["host"] = host
        context["port"] = port

        return context


class CustomPasswordResetEmail(BaseCustomEmail, PasswordResetEmail):
    template_name = "accounts/email/password_reset_confirm.html"


class CustomActivationEmail(BaseCustomEmail, ActivationEmail):
    template_name = "accounts/email/activation.html"