from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import base64

# Encrypt data using RSA private key
def encrypt_data(public_key, data):
    key = RSA.import_key(public_key)
    cipher = PKCS1_OAEP.new(key)
    encrypted_data = cipher.encrypt(data.encode('utf-8'))
    return base64.b64encode(encrypted_data).decode('utf-8')

# Decrypt data using RSA private key
def decrypt_data(private_key, encrypted_data):
    key = RSA.import_key(private_key)
    cipher = PKCS1_OAEP.new(key)
    decrypted_data = cipher.decrypt(base64.b64decode(encrypted_data))
    return decrypted_data.decode('utf-8')