from django.core.management.base import BaseCommand
from Crypto.PublicKey import RSA
from django.conf import settings
import os

class Command(BaseCommand):
    help = "Generates an RSA key pair and saves it in the specified directory."

    def handle(self, *args, **kwargs):
        # Generate RSA Key Pair
        key = RSA.generate(2048)
        private_key = key.export_key()
        public_key = key.publickey().export_key()

        # Define the paths where keys will be stored
        keys_dir = os.path.join(settings.BASE_DIR, 'rsa_keys')
        private_key_path = os.path.join(keys_dir, 'private_key.pem')
        public_key_path = os.path.join(keys_dir, 'public_key.pem')

        # Ensure the directory exists
        os.makedirs(keys_dir, exist_ok=True)

        # Write the private key to a file
        with open(private_key_path, 'wb') as private_file:
            private_file.write(private_key)
        # Write the public key to a file
        with open(public_key_path, 'wb') as public_file:
            public_file.write(public_key)

        self.stdout.write(self.style.SUCCESS("RSA key pair generated and saved successfully."))
