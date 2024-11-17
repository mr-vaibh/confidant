import base64
import json
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Decrypt sensitive data using the provided private key."

    def add_arguments(self, parser):
        parser.add_argument('--encrypted_data', type=str, required=True, help="Base64 encoded encrypted data.")
        parser.add_argument('--private_key_file', type=str, required=True, help="Path to the private key file (base64-encoded).")

    def handle(self, *args, **options):
        encrypted_data_b64 = options['encrypted_data']
        private_key_file_path = options['private_key_file']

        try:
            # Read and decode the private key from the file
            with open(private_key_file_path, 'r') as key_file:
                private_key_b64 = key_file.read().strip()
            private_key_data = base64.b64decode(private_key_b64)
            private_key = RSA.import_key(private_key_data)
        except Exception as e:
            raise CommandError(f"Failed to read, decode, or import the private key: {e}")

        try:
            # Decode the encrypted data from base64
            encrypted_data = base64.b64decode(encrypted_data_b64)

            # Decrypt the data
            cipher = PKCS1_OAEP.new(private_key)
            decrypted_data = cipher.decrypt(encrypted_data).decode("utf-8")

            self.stdout.write(self.style.SUCCESS("Decrypted data:"))
            self.stdout.write(decrypted_data)
        except Exception as e:
            raise CommandError(f"Failed to decrypt data: {e}")
