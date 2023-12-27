from flask import Flask, jsonify, request, render_template, Response, redirect, url_for, session, flash
from flask_cors import CORS
import bcrypt
import os
import uuid
import requests
import random
import json  # Import the json module

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get('SECRET_KEY', 'S3cR#tK3y_2023$!')

# MongoDB Data API configuration
mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
mongo_data_api_key = os.environ.get('MONGO_DATA_API_KEY', 'vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4')




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


@app.route('/', methods=['GET'])
def home():
    if 'username' in session:
        # Fetch the user's data from MongoDB
        query_url = f'{mongo_data_api_url}/action/findOne'
        query_body = {
            'dataSource': 'Cluster0',
            'database': 'yourDatabase',
            'collection': 'users',
            'filter': {'username': session['username']}
        }
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}
        response = requests.post(query_url, headers=headers, data=json.dumps(query_body))

        if response.status_code == 200:
            user_data = response.json().get('document')
            if user_data:
                # Pass the avatar URL and username to the template
                return render_template('index.html', avatar_url=user_data.get('avatar', 'static/img/avatar/avatar_01.jpg'), username=session['username'])
            else:
                flash('User data not found.', 'error')
        else:
            flash('Error fetching user data.', 'error')

        return redirect(url_for('login'))
    
    return redirect(url_for('login'))



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        query_url = f'{mongo_data_api_url}/action/findOne'
        query_body = {
            'dataSource': 'Cluster0',
            'database': 'yourDatabase',
            'collection': 'users',
            'filter': {'username': request.form['username']}
        }
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}

        response = requests.post(query_url, headers=headers, data=json.dumps(query_body))

        if response.status_code == 200:
            response_data = response.json()  # Get the response JSON
            user_data = response_data.get('document')  # Extract the user data from the 'document' key
            if user_data and 'password' in user_data:
                # Compare the hashed passwords
                if bcrypt.checkpw(request.form['password'].encode('utf-8'), user_data['password'].encode('utf-8')):
                    session['username'] = user_data['username']
                    return redirect(url_for('home'))
                else:
                    flash('Invalid username/password combination.','error')
            else:
                flash('User not found or password missing.','error')
        else:
            flash('Login error with status code: {}'.format(response.status_code))
            # Optionally, log the response status code and text for debugging
            # print(f'Error: Status Code {response.status_code}, {response.text}')

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # List of pre-made avatar images (local paths or URLs)
        avatar_images = [
    'static/img/avatar/avatar_01.jpg',
    'static/img/avatar/avatar_02.jpg',
    'static/img/avatar/avatar_03.jpg',
    'static/img/avatar/avatar_04.jpg',
    'static/img/avatar/avatar_05.jpg',
    'static/img/avatar/avatar_06.jpg',
    'static/img/avatar/avatar_07.jpg',
    'static/img/avatar/avatar_08.jpg',
    'static/img/avatar/avatar_09.jpg',
    'static/img/avatar/avatar_10.jpg',
    'static/img/avatar/avatar_11.jpg',
    'static/img/avatar/avatar_12.jpg',
    'static/img/avatar/avatar_13.jpg',
    'static/img/avatar/avatar_14.jpg',
    'static/img/avatar/avatar_15.jpg',
    'static/img/avatar/avatar_16.jpg',
    'static/img/avatar/avatar_17.jpg',
    'static/img/avatar/avatar_18.jpg',
    'static/img/avatar/avatar_19.jpg',
    'static/img/avatar/avatar_20.jpg',
    'static/img/avatar/avatar_21.jpg',
    'static/img/avatar/avatar_22.jpg',
    'static/img/avatar/avatar_23.jpg',
    'static/img/avatar/avatar_24.jpg',
    'static/img/avatar/avatar_25.jpg',
    # Add more if needed
]

        # Randomly select an avatar image
        selected_avatar = random.choice(avatar_images)

        # Prepare user data with the randomly selected avatar
        user_data = {
            'username': request.form['username'],
            'password': bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'avatar': selected_avatar
        }

        # MongoDB Data API request
        insert_url = f'{mongo_data_api_url}/action/insertOne'
        body = {'dataSource': 'Cluster0', 'database': 'yourDatabase', 'collection': 'users', 'document': user_data}
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}

        response = requests.post(insert_url, headers=headers, data=json.dumps(body))

        if response.status_code == 200 or 'insertedId' in response.text:
            flash('Signup successful! You can now login.', 'success')
            return redirect(url_for('login'))
        else:
            error_message = response.json().get('error', 'Unknown error occurred.')
            flash(f'Signup failed. {error_message}', 'error')

    return render_template('signup.html')




@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
