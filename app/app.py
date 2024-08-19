from flask import Flask, jsonify, request, render_template, Response, redirect, url_for, session, flash
from flask_cors import CORS
import hmac
import hashlib
import requests
import bcrypt
import os
import replicate
import uuid
import random
import logging
import json
import io
import base64
import time
import openai

app = Flask(__name__)

# Configura CORS para permitir solicitudes de tus dominios específicos usando regex
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://roomdesigner.onrender.com",
            r"https:\/\/pub-[0-9a-f]{32}\.r2\.dev",
            r"https:\/\/cdn2\.stablediffusionapi\.com"
        ]
    }
})

logging.basicConfig(level=logging.INFO)



app.secret_key = os.environ.get('SECRET_KEY', 'S3cR#tK3y_2023$!')

# MongoDB Data API configuration
mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
mongo_data_api_key = os.environ.get('MONGO_DATA_API_KEY', 'vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4')


#replicate token 
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')


# Fetch the API key from the environment
openai_api_key = os.environ.get('OPENAI_API_KEY')
if openai_api_key:
    logging.debug("OpenAI API Key is set.")
else:
    logging.debug("OpenAI API Key is NOT set.")

# Set the API key for OpenAI
openai.api_key = openai_api_key

def transform_prompt(prompt_text):
    messages = [
       {
            "role": "system",
            "content": "You are a helpful assistant that transforms lists of values into natural language descriptions. Give priority to person, then  design style, then home room or area, then the rest of values. When find color values names, place them in order primary color as dominant, secondary color as complementary, and tertiary color as accent. Add the RGB color value to the prompt too. colors are mandatory"
        },
        {
            "role": "user",
            "content": f"Transform the following list of values into a detailed and professional natural language prompt in less than 700 characters:\n\n{prompt_text}"
        }
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=messages,
        max_tokens=700,  # Adjust the token count as needed
        temperature=0.7,
    )

    transformed_prompt = response.choices[0].message['content'].strip()
    return transformed_prompt

# Define the polling function to check image availability
def check_image_availability(url, timeout=60, interval=5):
    """Poll the URL until the image is available or timeout is reached."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.head(url)
            if response.status_code == 200:
                return True
        except requests.RequestException as e:
            print(f"Error checking image URL: {e}")
        time.sleep(interval)
    return False



# Define your generate_images endpoint
@app.route('/generate-images', methods=['POST'])
def generate_images():
    try:
        if 'username' not in session:
            return jsonify({"error": "Not logged in"}), 401

        username = session['username']
        user_data = get_user_data(username)
        if user_data and user_data.get('credits', 0) >= 2:
            data = request.get_json()

            # Extract the promptText from the incoming data
            prompt_text = data.get('prompt')

            if not prompt_text:
                return jsonify({"error": "Missing prompt text"}), 400

            # Transform the prompt using OpenAI API (or any other transformation)
            transformed_prompt = transform_prompt(prompt_text)

            # Update the prompt in the data with the transformed prompt
            data['prompt'] = transformed_prompt

            # Choose the correct URL based on whether it's an img2img request
            url = 'https://modelslab.com/api/v6/images/img2img' if 'init_image' in data else 'https://modelslab.com/api/v6/images/text2img'
            response = requests.post(url, json=data, timeout=180)  # Aumenta el tiempo de espera a 180 segundos

            if response.status_code == 200:
                result = response.json()
                request_id = result.get('id')  # Get the request_id to fetch images later

                if not request_id:
                    return jsonify({"error": "No request_id returned by the server"}), 500

                # Fetch the images using the request_id
                fetch_url = 'https://modelslab.com/api/v6/images/fetch'
                fetch_payload = {
                    "key": data.get('key'),  # Assuming the API key is passed in the original request
                    "request_id": request_id
                }

                # Poll the fetch API to check if the images are ready
                retries = 10
                delay = 5  # Start with a 5-second delay

                for i in range(retries):
                    fetch_response = requests.post(fetch_url, json=fetch_payload, timeout=60)
                    if fetch_response.status_code == 200:
                        fetch_result = fetch_response.json()
                        if fetch_result['status'] == "success":
                            # Images are ready, return them to the user
                            deduct_credits(username, 2)
                            fetch_result['transformed_prompt'] = transformed_prompt  # Include the transformed prompt in the response
                            return jsonify(fetch_result)
                    time.sleep(delay)  # Wait for the delay before retrying
                    delay *= 2  # Exponential backoff: double the delay each time

                return jsonify({"error": "Image generation timed out"}), 408
            else:
                return jsonify({"error": "Image generation failed"}), response.status_code
        else:
            return jsonify({"error": "Insufficient credits"}), 403

    except requests.exceptions.Timeout:
        return jsonify({"error": "The request timed out. Please try again."}), 504  # Gateway Timeout
    except requests.exceptions.RequestException as e:
        # Catch all other requests exceptions and return an error
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    except Exception as e:
        # Catch any other exceptions and return an error
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


    
    
    
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
        email = request.form['email'].lower()  # Convert to lowercase before storing

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
        logging.info(f"/get-credits request from {username}")
        return jsonify({"credits": user_data.get('credits', 0)})
    else:
        logging.info(f"/get-credits request - User data not found for {username}")
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

import logging

@app.route('/lemonsqueezy_webhook', methods=['POST'])
def lemonsqueezy_webhook():
    if not is_valid_signature(request):
        logging.error("Invalid signature")
        return "Invalid signature", 403

    data = request.json
    logging.info(f"Received data: {data}")
    
    event_name = data.get('meta', {}).get('event_name')
    if event_name == 'order_created':
        user_email = data.get('data', {}).get('attributes', {}).get('user_email')
        if user_email:
            user_email = user_email.lower()  # Convert to lowercase for consistency
            response = update_user_credits(user_email, 100)
            logging.info(f"Update response: {response.status_code} - {response.text}")
            return '', 200
        else:
            logging.error("No user email found in data")
            return "No user email", 400
    return '', 200

lemon_squeezy_secret = os.environ.get('33luange1gean', 'default_secret')

def is_valid_signature(request):
    secret = lemon_squeezy_secret.encode()
    signature = request.headers.get('X-Signature')
    expected_signature = hmac.new(key=secret, msg=request.data, digestmod=hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

def update_user_credits(email, additional_credits):
    mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
    mongo_data_api_key = "vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4"

    payload = {
        "dataSource": "Cluster0",
        "database": "yourDatabase",
        "collection": "users",
        "filter": {"email": email},  # Using 'email' field for consistency
        "update": {"$inc": {"credits": additional_credits}}
    }

    headers = {
        "Content-Type": "application/json",
        "api-key": mongo_data_api_key
    }

    response = requests.patch(f"{mongo_data_api_url}/action/updateOne", headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        logging.info(f"Credits updated successfully for {email}")
    else:
        logging.error(f"Failed to update credits for {email}: {response.text}")

    return response


#clarity
@app.route('/clarity-upscale', methods=['POST'])
def clarity_upscale():
    try:
        data = request.json
        image_url = data.get('image_url')

        if not image_url:
            logging.error("No se proporcionó URL de imagen")
            return jsonify({'error': 'No se proporcionó URL de imagen'}), 400

        logging.info(f"Procesando imagen desde URL: {image_url}")

        # Preparar el input con la clave correcta
        input_data = {"image": image_url}

        # Ejecutar el modelo directamente utilizando replicate.run()
        output = replicate.run(
            "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
            input=input_data
        )

        logging.info(f"Imagen escalada correctamente: {output}")
        return jsonify({'output': output}), 200

    except Exception as e:
        logging.error(f"Error durante el escalado de la imagen: {str(e)}")
        return jsonify({'error': str(e)}), 500
    

# A dictionary to store the comparison data
comparisons = {}

@app.route('/create-comparison-session', methods=['POST'])
def create_comparison_session():
    data = request.json
    user_image_base64 = data['userImageBase64']
    generated_image_url = data['generatedImageUrl']

    # Generate a unique slug
    slug = str(uuid.uuid4())

    # Store the comparison data
    comparisons[slug] = {
        'user_image_base64': user_image_base64,
        'generated_image_url': generated_image_url
    }

    return jsonify({'slug': slug})

@app.route('/compare/<slug>')
def compare_images(slug):
    if slug in comparisons:
        data = comparisons[slug]
        # Render a template that dynamically loads the comparison view
        # Pass the base64 and URL data to the template
        return render_template('compare.html', data=data)
    else:
        return "Comparison not found", 404



@app.route('/relight')
def relight_page():
    return render_template('relight.html')

@app.route('/api/relight', methods=['POST'])
def relight_image():
    if 'image' not in request.files or 'prompt' not in request.form:
        return jsonify({'status': 'error', 'message': 'No image or prompt provided'})

    image_file = request.files['image']
    prompt = request.form['prompt']
    image = Image.open(image_file.stream)

    # Process the image using IC-Light
    relighted_image = iclight.relight(image, prompt)

    buffered = io.BytesIO()
    relighted_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({'status': 'success', 'image': img_str, 'prompt': prompt})

# Set upload folder
UPLOAD_FOLDER = 'static/uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/relight')
def relight():
    return render_template('relight.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        prompt = request.form.get('prompt', '')
        relighted_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'relighted_' + file.filename)
        relight_image(filename, relighted_image_path, prompt)  # Call relighting function
        return jsonify({'relighted_image_url': relighted_image_path})
    return jsonify({'error': 'File upload failed'}), 500

@app.route('/logout')
def logout():
    # Clear all data stored in the session
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)