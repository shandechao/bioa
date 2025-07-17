import requests
from PIL import Image
from io import BytesIO
import random

API_URL = "http://localhost:3000/api/upload"  


def generate_image(width, height):
    img = Image.new("RGB", (width, height), color=(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer

def test_uploads(num_tests=20):
    for i in range(num_tests):
        width = random.randint(200, 800)
        height = random.randint(200, 800)

        img_buffer = generate_image(width, height)
        files = {"file": (f"user_{i}.png", img_buffer, "image/png")}

        try:
            response = requests.post(API_URL, files=files)
            print(f"✅ [user_{i}] {width}x{height} - status={response.status_code}")
        except Exception as e:
            print(f"❌ [user_{i}] {width}x{height} - upload failed: {e}")



test_uploads(20)