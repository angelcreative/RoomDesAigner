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
    if 'username' not in session:
        return jsonify({"error": "Not logged in"}), 401

    username = session['username']
    user_data = get_user_data(username)
    if user_data and user_data.get('credits', 0) >= 2:
        data = request.get_json()
        url = 'https://modelslab.com/api/v6/images/img2img' if 'init_image' in data else 'https://modelslab.com/api/v6/images/text2img'
        response = requests.post(url, json=data)
        if response.status_code == 200:
            deduct_credits(username, 2)
            return jsonify(response.json())
        else:
            return jsonify({"error": "Image generation failed"}), response.status_code
    else:
        return jsonify({"error": "Insufficient credits"}), 403

def get_user_data(username):
    query_url = f'{mongo_data_api_url}/action/findOne'
    query_body = {
        'dataSource': 'Cluster0',
        'database': 'yourDatabase',
        'collection': 'users',
        'filter': {'username': username}
    }
    headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}
    response = requests.post(query_url, headers=headers, data=json.dumps(query_body))
    if response.status_code == 200:
        return response.json().get('document')
    return None

def deduct_credits(username, amount):
    update_url = f'{mongo_data_api_url}/action/updateOne'
    update_body = {
        'dataSource': 'Cluster0',
        'database': 'yourDatabase',
        'collection': 'users',
        'filter': {'username': username},
        'update': {'$inc': {'credits': -amount}}
    }
    headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}
    requests.post(update_url, headers=headers, data=json.dumps(update_body))

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
                            return render_template('index.html', avatar_url=user_data.get('avatar', 'default_avatar_url.svg'), username=session['username'], credits=user_data.get('credits', 0))
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
    'static/img/avatar/avatar_01.svg',
    'static/img/avatar/avatar_02.svg',
    'static/img/avatar/avatar_03.svg',
    'static/img/avatar/avatar_04.svg',
    'static/img/avatar/avatar_05.svg',
    'static/img/avatar/avatar_06.svg',
    'static/img/avatar/avatar_07.svg',
    'static/img/avatar/avatar_08.svg',
    'static/img/avatar/avatar_09.svg',
    'static/img/avatar/avatar_10.svg',
    'static/img/avatar/avatar_11.svg',
    'static/img/avatar/avatar_12.svg',
    'static/img/avatar/avatar_13.svg',
    'static/img/avatar/avatar_14.svg',
    'static/img/avatar/avatar_15.svg',
    'static/img/avatar/avatar_16.svg',
    'static/img/avatar/avatar_17.svg',
    'static/img/avatar/avatar_18.svg',
    'static/img/avatar/avatar_19.svg',
    'static/img/avatar/avatar_20.svg',
    'static/img/avatar/avatar_21.svg',
    'static/img/avatar/avatar_22.svg',
    'static/img/avatar/avatar_23.svg',
    'static/img/avatar/avatar_24.svg',
    'static/img/avatar/avatar_25.svg',
    'static/img/avatar/avatar_26.svg',
    'static/img/avatar/avatar_27.svg',
    'static/img/avatar/avatar_28.svg',
    'static/img/avatar/avatar_29.svg',
    'static/img/avatar/avatar_30.svg',
    'static/img/avatar/avatar_31.svg',
    'static/img/avatar/avatar_32.svg',
    'static/img/avatar/avatar_33.svg',
    'static/img/avatar/avatar_34.svg',
    'static/img/avatar/avatar_35.svg',
    'static/img/avatar/avatar_36.svg',
    'static/img/avatar/avatar_37.svg',
    'static/img/avatar/avatar_38.svg',
    'static/img/avatar/avatar_39.svg',
    'static/img/avatar/avatar_40.svg',
    'static/img/avatar/avatar_41.svg',
    'static/img/avatar/avatar_42.svg',
    'static/img/avatar/avatar_43.svg',
    'static/img/avatar/avatar_44.svg',
    'static/img/avatar/avatar_45.svg',
    'static/img/avatar/avatar_46.svg',
    'static/img/avatar/avatar_47.svg',
    'static/img/avatar/avatar_48.svg',
    'static/img/avatar/avatar_49.svg',
    'static/img/avatar/avatar_50.svg',
    'static/img/avatar/avatar_51.svg',
    'static/img/avatar/avatar_52.svg',
    'static/img/avatar/avatar_53.svg',
    'static/img/avatar/avatar_54.svg',
    'static/img/avatar/avatar_55.svg',
    'static/img/avatar/avatar_56.svg',
    'static/img/avatar/avatar_57.svg',
    'static/img/avatar/avatar_58.svg',
    'static/img/avatar/avatar_59.svg',
    'static/img/avatar/avatar_60.svg',

    # Add more if needed
]

        # Randomly select an avatar image
        selected_avatar = random.choice(avatar_images)

        # Prepare user data with the randomly selected avatar
        user_data = {
            'username': request.form['username'],
            'password': bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            'avatar': selected_avatar,
            'credits': 20 

        }

        # MongoDB Data API request
        insert_url = f'{mongo_data_api_url}/action/insertOne'
        body = {'dataSource': 'Cluster0', 'database': 'yourDatabase', 'collection': 'users', 'document': user_data}
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}

        response = requests.post(insert_url, headers=headers, data=json.dumps(body))

        if response.status_code == 200 or 'insertedId' in response.text:
            flash('Signup successful! You got 20 🟡 coins!.', 'success')
            return redirect(url_for('login'))
        else:
            error_message = response.json().get('error', 'Unknown error occurred.')
            flash(f'Signup failed. {error_message}', 'error')

    return render_template('signup.html')


@app.route('/get-credits', methods=['GET'])
def get_credits():
    if 'username' not in session:
        return jsonify({"error": "Not logged in"}), 401

    username = session['username']
    user_data = get_user_data(username)
    if user_data:
        return jsonify({"credits": user_data.get('credits', 0)})
    else:
        return jsonify({"error": "User data not found"}), 404


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)