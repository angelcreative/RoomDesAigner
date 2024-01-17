from flask import Flask, jsonify, request, render_template, Response, redirect, url_for, session, flash
from flask_cors import CORS
import hmac
import hashlib
import requests
import bcrypt
import os
import uuid
import requests
import random
import json
# Import the json module

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
        url = 'https://stablediffusionapi.com/api/v3/img2img' if 'init_image' in data else 'https://stablediffusionapi.com/api/v3/text2img'
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
        # Use session data directly instead of fetching from the database
        username = session['username']
        avatar_url = session.get('avatar', 'static/img/avatar/avatar_01.svg')  # Default avatar if not set
        credits = session.get('credits', 0)  # Default to 0 if credits not set

        # Pass the avatar URL, username, and credits to the template
        return render_template('index.html', username=username, avatar_url=avatar_url, credits=credits)
    else:
        # Redirect to login page if not logged in
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
            response_data = response.json()
            user_data = response_data.get('document')
            
            if user_data and 'password' in user_data:
                if bcrypt.checkpw(request.form['password'].encode('utf-8'), user_data['password'].encode('utf-8')):
                    session['username'] = user_data['username']
                    session['avatar'] = user_data.get('avatar', 'static/img/avatar/avatar_01.svg')
                    session['credits'] = user_data.get('credits', 0)

                    # Redirect to upgrade page if credits are 0
                    if session['credits'] <= 0:
                        return redirect(url_for('upgrade'))
                    else:
                        return redirect(url_for('home'))
                else:
                    flash('Invalid username/password combination.', 'error')
            else:
                flash('User not found or password missing.', 'error')
        else:
            flash('Login error with status code: {}'.format(response.status_code))

    return render_template('login.html')


@app.route('/upgrade')
def upgrade():
    # Your logic to display the upgrade page
    return render_template('upgrade.html')



@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Set the default avatar to 'avatar_01.svg' instead of randomly selecting one
        default_avatar = 'static/img/avatar/avatar_01.svg'
        
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
    'static/img/avatar/default_avatar_url.svg',
    # Add more if needed
]

        # Randomly select an avatar image
        selected_avatar = random.choice(avatar_images)
        
         # Retrieve email from the form data
        email = request.form['email']


        # Prepare user data with the randomly selected avatar
        user_data = {
                'username': request.form['username'],
                'email': email,  # Include email here
                'password': bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                'avatar': default_avatar, 
                'credits': 5

        }

        # MongoDB Data API request
        insert_url = f'{mongo_data_api_url}/action/insertOne'
        body = {'dataSource': 'Cluster0', 'database': 'yourDatabase', 'collection': 'users', 'document': user_data}
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}

        response = requests.post(insert_url, headers=headers, data=json.dumps(body))

        if response.status_code == 200 or 'insertedId' in response.text:
            flash('Signup successful! You got 5 🟡 coins! This is trial period, after it, you can upgrade your account.', 'success')
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

@app.route('/change-avatar', methods=['POST'])
def change_avatar():
    if 'username' in session:
        new_avatar = request.form['new_avatar']  # Retrieve the new avatar from the form data
        username = session['username']

        # Update the avatar in the database
        query_url = f'{mongo_data_api_url}/action/updateOne'
        update_body = {
            'dataSource': 'Cluster0',
            'database': 'yourDatabase',
            'collection': 'users',
            'filter': {'username': username},
            'update': {'$set': {'avatar': new_avatar}}
        }
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}
        response = requests.post(query_url, headers=headers, data=json.dumps(update_body))

        if response.status_code == 200:
            # Update the avatar in the session
            session['avatar'] = new_avatar
            return 'Avatar updated successfully', 200
        else:
            return 'Error updating avatar in database', 500
    else:
        return 'User not logged in', 401
      
    
@app.route('/lemonsqueezy_webhook', methods=['POST'])
def lemonsqueezy_webhook():
    if not is_valid_signature(request):
        print("Invalid signature")
        return "Invalid signature", 403
    data = request.json
    print("Received data:", data)
    
    event_name = data.get('meta', {}).get('event_name')
    if event_name == 'order_created':
        user_email = data.get('data', {}).get('attributes', {}).get('email')  # use 'email' instead of 'user_email'
        print("User email from order:", user_email)
        if user_email:
            response = update_user_credits(user_email, 100)
            print("Update response:", response.text)
            return '', 200
        else:
            print("No user email found in data")
            return "No user email", 400
    return '', 200
def is_valid_signature(request):
    secret = '33luange1gean'  # Replace with your actual Lemon Squeezy signing secret
    signature = request.headers.get('X-Signature')
    expected_signature = hmac.new(key=secret.encode(), msg=request.data, digestmod=hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
def update_user_credits(email, additional_credits):
    mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
    mongo_data_api_key = "vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4"

  
    
    payload = {
        "dataSource": "Cluster0",
        "database": "yourDatabase",  # Replace with your actual database name
        "collection": "users",  # Replace with your actual collection name
        "filter": {"email": email},  # Ensure the key here is 'email'
        "update": {"$inc": {"credits": additional_credits}}
    }

    headers = {
        "Content-Type": "application/json",
        "api-key": mongo_data_api_key
    }

    response = requests.patch(f"{mongo_data_api_url}/action/updateOne", headers=headers, data=json.dumps(payload))
    return response  

    
@app.route('/logout')
def logout():
    # Clear all data stored in the session
    session.clear()
    return redirect(url_for('login'))



if __name__ == '__main__':
    app.run(debug=True)