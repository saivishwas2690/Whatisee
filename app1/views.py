import os
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import google.generativeai as genai
from django.conf import settings

def home(request):
    if request.method == 'POST':
        if 'image' in request.FILES:
            image = request.FILES['image']
            print("found image")
            

            temp_dir = os.path.join(settings.BASE_DIR, 'media', 'temp_images')
            os.makedirs(temp_dir, exist_ok=True)

            file_path = os.path.join(temp_dir, image.name)
            with open(file_path, 'wb') as temp_file:
                for chunk in image.chunks():
                    temp_file.write(chunk)

            print("created")

            try:
                with Image.open(file_path) as pil_image:
                    genai.configure(api_key=settings.GEMINI_API_KEY)
                    model = genai.GenerativeModel(model_name="gemini-1.5-pro")
                    prompt = "Describe what you see in image creatively."
                    response = model.generate_content([prompt, pil_image])
                
                os.remove(file_path)

                return JsonResponse({"description": response.text})

            except Exception as e:
                if os.path.exists(file_path):
                    os.remove(file_path)

                return JsonResponse({"error": str(e)}, status=500)

        return JsonResponse({"error": "No image provided"}, status=400)

    return render(request, 'app1/home.html')
