from flask import Flask, jsonify, request, render_template, Response, redirect, url_for, session, flash
from pydantic import BaseModel, Field
from typing import Optional
from flask_cors import CORS
import hmac
import hashlib
import requests
import bcrypt
import replicate
import os
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
#CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app)

@app.route('/image-proxy')
def image_proxy():
    image_url = request.args.get('url')
    try:
        response = requests.get(image_url, timeout=5)  # Añadir un timeout para evitar bloqueos
        if response.status_code == 200:
            return Response(response.content, mimetype=response.headers['Content-Type'])
        else:
            return "Image could not be fetched", 400
    except requests.exceptions.RequestException as e:
        return f"Error fetching image: {str(e)}", 500
    
logging.basicConfig(level=logging.INFO)



app.secret_key = os.environ.get('SECRET_KEY', 'S3cR#tK3y_2023$!')

# MongoDB Data API configuration
mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
mongo_data_api_key = os.environ.get('MONGO_DATA_API_KEY', 'vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4')


#replicate token 
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')


@app.route('/clarity-upscale', methods=['POST'])
def clarity_upscale():
    try:
        data = request.get_json()
        image_url = data.get('image_url')

        if not image_url:
            return jsonify({"error": "Image URL is required"}), 400

        # Configura la solicitud al API de Replicate
        url = "https://api.replicate.com/v1/predictions"
        headers = {
            "Authorization": f"Token {REPLICATE_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "version": "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
            "input": {"image": image_url},
            "webhook": "https://www.roomdesaigner.com/webhook",  # Cambia esto a tu URL de webhook
            "webhook_events_filter": ["completed"]  # Solo recibir notificaciones cuando se complete
        }

        # Hacemos la solicitud POST a la API de Replicate
        response = requests.post(url, json=payload, headers=headers)

        # Verificamos el estado de la respuesta
        if response.status_code == 201:
            prediction = response.json()
            return jsonify({"id": prediction["id"]}), 200
        else:
            return jsonify({"error": "Failed to start prediction", "details": response.json()}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    prediction_id = data.get('id')
    status = data.get('status')
    
    if not prediction_id or not status:
        return jsonify({"error": "Invalid data received"}), 400

    if status == 'succeeded':
        output_urls = data.get('output', [])
        if output_urls:
            # Aquí puedes guardar la URL en la base de datos o enviar una notificación al cliente
            logging.info(f"Predicción {prediction_id} completada con éxito. URLs: {output_urls}")
        else:
            logging.error(f"Predicción {prediction_id} completada, pero no se encontraron URLs.")
    
    return jsonify({"status": "received"}), 200
 
    
    
    
    
openai_api_key = os.environ.get('OPENAI_API_KEY')
if openai_api_key:
    logging.debug("OpenAI API Key is set.")
else:
    logging.debug("OpenAI API Key is NOT set.")

# Set the API key for OpenAI
openai.api_key = openai_api_key

def transform_prompt(prompt_text):
    # Detecta si el prompt es sobre personas
    if "person" in prompt_text.lower() or "woman" in prompt_text.lower() or "man" in prompt_text.lower() or "people" in prompt_text.lower():
        # Estructura para prompts sobre personas
        messages = [
           {
                "role": "system",
                "content": "You are a helpful assistant that transforms lists of values into structured natural language descriptions. For prompts about people, follow this structure: Subject (e.g., young woman, man), Hair/Skin color (e.g., long brown hair, pale skin), Pose (e.g., sitting, standing), Clothing/Accessories (e.g., wearing a red dress), Emotion (e.g., smiling, thoughtful), Location (e.g., in a park), and Technical Details (e.g., shot with a 50mm lens). Color Palette (mention RGB values).Generate a complete and natural description, not just labels."
            },
            {
                "role": "user",
                "content": f"Transform the following list of values into a detailed, professional natural language prompt, in less than 700 characters:\n\n{prompt_text}"
            }
        ]
    
    # Detecta si el prompt menciona elementos tipográficos, animales, o estilos artísticos específicos
    elif "typographic" in prompt_text.lower() or "silhouette" in prompt_text.lower() or "line art" in prompt_text.lower() or "geometric" in prompt_text.lower() or "logo" in prompt_text.lower():
        # Estructura para logos y estilos artísticos
        messages = [
           {
                "role": "system",
                "content": "You are a helpful assistant that transforms lists of values into structured natural language descriptions for logos and artistic styles. Follow this structure: Subject (e.g., a geometric logo), Style (e.g., minimalist, retro), Composition (e.g., centered, using simple shapes), Color Palette (mention RGB values), Mood/Atmosphere (e.g., elegant, playful), and Technical Details (e.g., vector format). Generate a complete and natural description, not just labels."
            },
            {
                "role": "user",
                "content": f"Transform the following list of values into a detailed, professional natural language prompt, in less than 700 characters:\n\n{prompt_text}"
            }
        ]
    
    # Detecta si el prompt es sobre diseño de interfaces
    elif "interface" in prompt_text.lower() or "UI" in prompt_text.lower() or "UX" in prompt_text.lower() or "dashboard" in prompt_text.lower():
        # Estructura para prompts sobre diseño de interfaces
        messages = [
           {
                "role": "system",
                "content": "You are a helpful assistant that transforms lists of values into structured natural language descriptions for UI/UX design. Follow this structure: Screen Type (e.g., dashboard, login screen), Main Elements (e.g., buttons, forms), Layout (e.g., grid layout), Style (e.g., modern, minimalistic), Color Palette (mention RGB values), Typography (e.g., sans-serif, bold), Interactions/Animations (e.g., hover effects, transitions), and Technical Details (e.g., responsive design). Generate a complete and natural description, not just labels."
            },
            {
                "role": "user",
                "content": f"Transform the following list of values into a detailed, professional natural language prompt, in less than 700 characters:\n\n{prompt_text}"
            }
        ]
    
    # Detecta si el prompt es sobre diseño de interiores
    elif "interior design" in prompt_text.lower() or "living room" in prompt_text.lower() or "bedroom" in prompt_text.lower() or "kitchen" in prompt_text.lower():
        # Estructura para prompts sobre diseño de interiores
        messages = [
           {
                "role": "system",
                "content": "You are a helpful assistant that transforms lists of values into structured natural language descriptions for interior design. Follow this structure: Room Type (e.g., living room, bedroom), Main Furniture (e.g., sofa, bed), Materials (e.g., wood, metal), Style (e.g., modern, Scandinavian), Color Palette (mention RGB values), Lighting (e.g., natural light, ceiling lamps), Decorative Elements (e.g., plants, rugs), Mood/Atmosphere (e.g., cozy, elegant), and Technical Details (e.g., room dimensions). Generate a complete and natural description, not just labels."
            },
            {
                "role": "user",
                "content": f"Transform the following list of values into a detailed, professional natural language prompt, in less than 700 characters:\n\n{prompt_text}"
            }
        ]
    
    else:
        # Estructura para prompts sobre otros elementos (escenas, objetos, etc.)
        messages = [
           {
                "role": "system",
                "content": "You are a helpful assistant that transforms lists of values into structured natural language descriptions. For non-human subjects (scenes, objects, etc.), follow this structure: Subject (e.g., a cityscape at night), Location (e.g., urban setting), Style (e.g., realistic, abstract), Composition (e.g., landscape view), Lighting (e.g., dim, natural light), Color Palette (mention RGB values), Mood/Atmosphere (e.g., mysterious, vibrant), and Technical Details (e.g., shot with a wide-angle lens). Generate a complete and natural description, not just labels."
            },
            {
                "role": "user",
                "content": f"Transform the following list of values into a detailed, professional natural language prompt, in less than 700 characters:\n\n{prompt_text}"
            }
        ]

    # Aquí iría el código para enviar el mensaje a OpenAI y procesar la respuesta


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



@app.route('/generate-images', methods=['POST'])
def generate_images():
    try:
        # Verifica si el usuario ha iniciado sesión
        if 'username' not in session:
            return jsonify({"error": "Not logged in"}), 401  # Retorna error 401 si el usuario no está autenticado

        # Obtiene el nombre de usuario desde la sesión
        username = session['username']
        # Recupera los datos del usuario
        user_data = get_user_data(username)

        # Verifica si el usuario tiene al menos 4 créditos disponibles
        if user_data and user_data.get('credits', 0) >= 4:  
            # Obtiene los datos de la solicitud POST en formato JSON
            data = request.get_json()

            # Extrae el campo 'prompt' del JSON recibido
            prompt_text = data.get('prompt')

            # Si no hay prompt, retorna un error 400 indicando que falta este campo
            if not prompt_text:
                return jsonify({"error": "Missing prompt text"}), 400

            # Aplica una transformación al texto del prompt
            transformed_prompt = transform_prompt(prompt_text)

            # Reemplaza el prompt original por el prompt transformado
            data['prompt'] = transformed_prompt

            # Elimina la clave 'key' si existe en los datos
            if 'key' in data:
                del data['key']

            # Agrega la clave API a los datos
            data['key'] = 'X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw'  # Reemplaza con tu clave API real

            # Define la URL de la API, dependiendo si es una solicitud img2img o text2img
            url = 'https://modelslab.com/api/v6/images/img2img' if 'init_image' in data else 'https://modelslab.com/api/v6/images/text2img'

            # Realiza la solicitud POST a la API con los datos proporcionados, con un timeout de 180 segundos
            response = requests.post(url, json=data, timeout=180)

            # Verifica si la respuesta del servidor fue exitosa
            if response.status_code == 200:
                result = response.json()

                # Si la respuesta indica éxito y contiene las imágenes generadas
                if result.get('status') == 'success' and result.get('output'):
                    # Deduce 4 créditos del usuario
                    deduct_credits(username, 4)  # Cambia a 4 créditos
                    # Actualiza la sesión del usuario para reflejar los nuevos créditos
                    session['credits'] -= 4  # Descuenta 4 créditos de la sesión
                    # Devuelve las imágenes generadas y el prompt transformado
                    return jsonify({
                        "images": result.get('output'),
                        "transformed_prompt": transformed_prompt,
                        "credits": session['credits']  # Devuelve los créditos restantes
                    }), 200

                # Si las imágenes están en proceso, devuelve un mensaje indicando que están procesándose
                elif result.get('status') == 'processing' and result.get('id'):
                    request_id = result.get('id')
                    # Devuelve un código 202 indicando que la solicitud ha sido aceptada pero aún no está lista
                    return jsonify({
                        "message": "La generación de imágenes está en proceso. Usa el endpoint /fetch-images para obtener las imágenes.",
                        "request_id": request_id,
                        "eta": result.get('eta'),  # Tiempo estimado para completar
                        "transformed_prompt": transformed_prompt
                    }), 202  # HTTP 202 Accepted

                # Si se obtiene una respuesta inesperada, retorna un error 500
                else:
                    return jsonify({"error": "Respuesta inesperada del servicio de generación de imágenes", "details": result}), 500

            # Si el servidor devuelve un código de error, lo retorna con los detalles de la respuesta
            else:
                return jsonify({"error": "La generación de imágenes falló", "details": response.text}), response.status_code

        # Si el usuario tiene 3 créditos o menos, muestra un mensaje

        elif user_data and user_data.get('credits', 0) <= 3:

            return jsonify({"error": "Créditos insuficientes. Por favor, visita Google para más información.", "redirect": "https://www.google.com"}), 403

    # Maneja los casos donde la solicitud a la API se agota por tiempo
    except requests.exceptions.Timeout:
        return jsonify({"error": "La solicitud agotó el tiempo de espera. Por favor, intenta de nuevo."}), 504

    # Maneja cualquier otro error relacionado con la solicitud a la API
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500

    # Captura cualquier otro error inesperado que ocurra en el servidor
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500




@app.route('/fetch-images', methods=['POST'])
def fetch_images():
    try:
        data = request.get_json()

        # Verificar que se haya proporcionado el request_id
        request_id = data.get('request_id')

        if not request_id:
            return jsonify({"error": "Missing request_id"}), 400

        # Construir la carga útil para la solicitud de fetch
        fetch_payload = {
            "key": 'X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw',  # Usa tu clave API almacenada en el servidor
            "request_id": request_id
        }

        fetch_url = "https://modelslab.com/api/v6/images/fetch"
        headers = {'Content-Type': 'application/json'}

        # Realizar la solicitud a la API de fetch
        fetch_response = requests.post(fetch_url, headers=headers, json=fetch_payload, timeout=60)

        if fetch_response.status_code == 200:
            result = fetch_response.json()

            # Si las imágenes están listas, devuélvelas
            if result.get('status') == 'success' and result.get('output'):
                # Deduce 2 créditos del usuario
                username = session['username']  # Asegúrate de que el usuario esté en la sesión
                deduct_credits(username, 2)  # Deduce 2 créditos
                return jsonify({
                    "status": "success",
                    "images": result.get('output')
                }), 200

            # Si aún están procesándose, devolver un estado de espera
            elif result.get('status') == 'processing':
                return jsonify({
                    "message": "Las imágenes aún se están procesando, por favor intenta más tarde.",
                    "status": "processing"
                }), 202

            else:
                return jsonify({"error": "Estado inesperado recibido del servidor", "details": result}), 500

        return jsonify({"error": "No se pudo obtener el estado de las imágenes", "details": fetch_response.text}), fetch_response.status_code

    except requests.exceptions.Timeout:
        return jsonify({"error": "La solicitud agotó el tiempo de espera. Por favor, intenta de nuevo."}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ocurrió un error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

    
    
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
            'credits': 100
        }

        # MongoDB Data API request
        insert_url = f'{mongo_data_api_url}/action/insertOne'
        body = {'dataSource': 'Cluster0', 'database': 'yourDatabase', 'collection': 'users', 'document': user_data}
        headers = {'Content-Type': 'application/json', 'api-key': mongo_data_api_key}

        response = requests.post(insert_url, headers=headers, data=json.dumps(body))

        if response.status_code == 200 or 'insertedId' in response.text:
            flash('Signup successful! You got 100 🟡 coins! This is trial period, after it, you can upgrade your account.', 'success')
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




    
    
@app.route('/load-saved-values', methods=['GET'])
def load_saved_values():
    if 'username' not in session:
        logging.error("User not logged in.")
        return jsonify({"error": "Not logged in"}), 401

    query_payload = {
        'dataSource': 'Cluster0',
        'database': 'yourDatabase',  # Reemplaza con tu nombre de base de datos
        'collection': 'saved_values',
        'filter': {'username': session['username']},
        'projection': {'_id': 1, 'name': 1}  # Solo devolvemos el id y el nombre de cada guardado
    }
    headers = {
        'Content-Type': 'application/json',
        'api-key': mongo_data_api_key
    }
    response = requests.post(
        f'{mongo_data_api_url}/action/find',
        headers=headers,
        data=json.dumps(query_payload)
    )

    logging.info(f"Response status code: {response.status_code}")
    logging.info(f"Response text: {response.text}")

    if response.status_code == 200:
        saved_values = response.json().get('documents', [])
        return jsonify({'savedValues': saved_values}), 200
    else:
        error_message = response.json().get('error', 'Unknown error occurred.')
        logging.error(f"Error loading saved values: {error_message}")
        return jsonify({'error': f"Error loading saved values: {error_message}"}), 500



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

#try

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