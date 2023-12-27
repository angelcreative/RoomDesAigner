from flask import Flask, jsonify, request, render_template, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/generate-images', methods=['POST'])
def generate_images():
    data = request.get_json()

    # Determina si es una solicitud img2img o txt2img
    if 'init_image' in data:
        # img2img: Usa la URL de la imagen directamente
        url = 'https://stablediffusionapi.com/api/v3/img2img'
    else:
        # txt2img: Sin imagen inicial
        url = 'https://stablediffusionapi.com/api/v3/text2img'

    response = requests.post(url, json=data)
    return jsonify(response.json())

@app.route('/proxy-image', methods=['GET'])
def proxy_image():
    image_url = request.args.get('url')
    image_response = requests.get(image_url, stream=True)
    headers = {'Content-Type': image_response.headers['Content-Type']}
    return Response(image_response.iter_content(chunk_size=1024), headers=headers)

if __name__ == '__main__':
    app.run()
