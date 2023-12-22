from flask import Flask, jsonify, request, render_template, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/generate-images', methods=['POST'])
def generate_images():
    # Extract the request payload
    data = request.get_json()

    # Make the API request to Stable Diffusion API through the proxy server
    response = requests.post('https://stablediffusionapi.com/api/v3/text2img', json=data)

    # Return the API response to the client
    return jsonify(response.json())

@app.route('/proxy-image', methods=['GET'])
def proxy_image():
    # Extract the image URL from the query parameters
    image_url = request.args.get('url')

    # Fetch the image from the remote server
    image_response = requests.get(image_url, stream=True)

    # Set the appropriate content type for the image
    headers = {'Content-Type': image_response.headers['Content-Type']}

    # Return the image as a response
    return Response(image_response.iter_content(chunk_size=1024), headers=headers)

if __name__ == '__main__':
    app.run()
