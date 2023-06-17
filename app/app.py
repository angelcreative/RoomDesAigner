from flask import Flask, jsonify, request, render_template
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

if __name__ == '__main__':

    app.run(debug=False)
