from flask import Flask, jsonify, request, render_template, Response, redirect, url_for, session, flash
from pydantic import BaseModel, Field
from typing import Optional
from flask_cors import CORS
from functools import wraps
from datetime import datetime
from utils.size_utils import get_size_characteristics, load_size_data
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
from pathlib import Path

app = Flask(__name__)

# Configura CORS para permitir solicitudes de tus dominios específicos usando regex
#CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://127.0.0.1:8080"}})

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
logger = logging.getLogger(__name__)


app.secret_key = os.environ.get('SECRET_KEY', 'S3cR#tK3y_2023$!')

# MongoDB Data API configuration
mongo_data_api_url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-qekvb/endpoint/data/v1"
mongo_data_api_key = os.environ.get('MONGO_DATA_API_KEY', 'vDRaSGZa9qwvm4KG8eSMd8QszqWulkdRnrdZBGewShkh75ZHRUHwVFdlruIwbGl4')


#replicate token 
REPLICATE_API_TOKEN = os.environ.get('REPLICATE_API_TOKEN')
os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN

def retry_with_backoff(max_retries=10, initial_delay=1, max_delay=10):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            retries = 0
            
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries == max_retries:
                        logger.error(f"Failed after {max_retries} attempts: {str(e)}")
                        raise e
                    
                    logger.warning(f"Attempt {retries} failed: {str(e)}")
                    time.sleep(delay)
                    delay = min(delay * 2, max_delay)
            
            return None
        return wrapper
    return decorator


@app.route('/upscale', methods=['POST'])
def upscale_image():
    try:
        data = request.json
        image_url = data.get('image_url')
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400

        print(f"🔄 Procesando imagen: {image_url}")

        # Usar el modelo directamente con replicate.run()
        output = replicate.run(
            "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
            input={
                "image": image_url
            }
        )

        print(f"✅ Respuesta de la API: {output}")

        # La salida puede ser una URL directa o estar en una lista
        if isinstance(output, list):
            output_url = output[0]
        else:
            output_url = output

        print(f"✅ URL final: {output_url}")
        
        return jsonify({
            'status': 'success',
            'upscaled_url': output_url
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True)

    
    
openai_api_key = os.environ.get('OPENAI_API_KEY')
if openai_api_key:
    logging.debug("OpenAI API Key is set.")
else:
    logging.debug("OpenAI API Key is NOT set.")

# Set the API key for OpenAI
openai.api_key = openai_api_key

# Define content structures for different categories
def get_content_for_people():
    return """
    You are a highly skilled assistant that transforms lists of values into structured, versatile natural language prompts for generating images of people. 
    Depending on the shot (close-up, midshot, or full-body), adapt the description to include the following:
    -  Subject : A [close-up, midshot, full-body shot] of [description of person: e.g., young woman, man].
    -  Facial Features & Skin : Emphasize highly detailed facial features, realistic skin texture, and natural lighting.
    -  Pose : Adjust based on shot type (e.g., head tilt for close-up, relaxed for midshot, standing for full body).
    -  Clothing & Accessories : Include dynamic folds in clothing and realistic textures, with accessories if present.
    -  Emotion : Describe the subject's emotion based on the scene.
    -  Environment : For close-up, use blurred backgrounds, for full-body, describe the setting (e.g., in a park).
    -  Lighting : Adapt lighting to the context (e.g., natural daylight or moody shadows).
    -  Technical Details : Adjust camera settings to shot type (85mm lens for close-up, wide-angle for full body).
    -  Color Palette : Mention RGB values for key elements. Ensure the colors align with the mood.
    Generate a full, professional prompt that adapts naturally to the type of shot, and ensure the description feels seamless, not just a list of attributes. Add DEI, diversity, body sizes, face beauty and non beauty, skin colors, if persons, not always must be white or beautiful, unless is specifically asked it must have diverse skin color: nordic or asian or hispanic or indian or arab or persian or latino or mulatto or afrodescendant as well as color hair: blonde or redhead or brunette or black or colored.
    """

def get_content_for_logos():
    return """
    You are a highly skilled assistant that transforms lists of values into structured, professional natural language descriptions for logos and artistic styles. 
    Adapt the description based on the following criteria to ensure a rich and detailed prompt:
    -  Subject : Clearly describe the main subject (e.g., a geometric logo, an abstract icon).
    -  Style : Specify the artistic style (e.g., minimalist, retro, futuristic).
    -  Composition : Provide details on the arrangement (e.g., centered, asymmetrical).
    -  Color Palette : Mention RGB values for the key colors.
    -  Mood/Atmosphere : Highlight the mood (e.g., playful, elegant).
    -  Typography : If applicable, describe the text, focusing on font style and size.
    -  Technical Details : Mention technical specifications (e.g., vector format, scalability).
    Generate a full, detailed, and natural description, ensuring cohesion and completeness.
    """

def get_content_for_ui_ux():
    return """
    You are a highly skilled assistant that transforms lists of values into structured, detailed natural language descriptions for UI/UX design. 
    Use the following structure to create comprehensive prompts:
    -  Screen Type : Specify the screen (e.g., dashboard, login screen).
    -  Main Elements : Highlight the key UI elements (e.g., buttons, forms).
    -  Layout : Describe the layout structure (grid-based, flexible).
    -  Style : Mention the style (modern, minimalistic) and visual consistency.
    -  Color Palette : Mention RGB values for primary and secondary colors.
    -  Typography : Detail typefaces, font sizes, and their roles in readability.
    -  Interactions/Animations : Describe interactions (e.g., hover effects, transitions).
    -  Technical Details : Include responsiveness, accessibility, and performance.
    Generate a professional prompt focusing on user experience and design cohesion.
    """

def get_content_for_interior_design():
    return """
    You are a highly skilled assistant that transforms lists of values into structured, detailed natural language descriptions for interior design. 
    Use the following structure to create comprehensive prompts:
    -  Room Type : Specify the room type (e.g., living room, bedroom).
    -  Main Furniture : Describe key pieces of furniture and their contribution to the space.
    -  Materials : Mention materials used (e.g., wood, metal) and their influence on atmosphere.
    -  Style : Specify the interior style (modern, Scandinavian).
    -  Color Palette : Mention the RGB values for dominant and accent colors.
    -  Lighting : Describe types of lighting and their effect.
    -  Decorative Elements : Describe decorative elements like plants, rugs.
    -  Mood/Atmosphere : Highlight the mood the space evokes (cozy, elegant).
    -  Technical Details : Mention dimensions and architectural features.
    Generate a full, natural description that integrates all these elements seamlessly.
    """

# Definir el nationality_mapping al inicio del archivo
nationality_mapping = {
    # Afganistán
    'afghan': 'afghanistan',
    'afghanistan': 'afghanistan',
    
    # Albania
    'albanian': 'albania',
    'albania': 'albania',
    
    # Argelia
    'algerian': 'algeria',
    'algeria': 'algeria',
    
    # Andorra
    'andorran': 'andorra',
    'andorra': 'andorra',
    
    # Angola
    'angolan': 'angola',
    'angola': 'angola',
    
    # Antigua y Barbuda
    'antiguan': 'antigua_and_barbuda',
    'antigua_and_barbuda': 'antigua_and_barbuda',
    
    # Argentina
    'argentinian': 'argentina',
    'argentina': 'argentina',
    
    # Armenia
    'armenian': 'armenia',
    'armenia': 'armenia',
    
    # Australia
    'australian': 'australia',
    'australia': 'australia',
    
    # Austria
    'austrian': 'austria',
    'austria': 'austria',
    
    # Azerbaiyán
    'azerbaijani': 'azerbaijan',
    'azerbaijan': 'azerbaijan',
    
    # Bahamas
    'bahamian': 'bahamas',
    'bahamas': 'bahamas',
    
    # Bahrein
    'bahraini': 'bahrain',
    'bahrain': 'bahrain',
    
    # Bangladesh
    'bangladeshi': 'bangladesh',
    'bangladesh': 'bangladesh',
    
    # Barbados
    'barbadian': 'barbados',
    'barbados': 'barbados',
    
    # Bielorrusia
    'belarusian': 'belarus',
    'belarus': 'belarus',
    
    # Bélgica
    'belgian': 'belgium',
    'belgium': 'belgium',
    
    # Belice
    'belizean': 'belize',
    'belize': 'belize',
    
    # Benin
    'beninese': 'benin',
    'benin': 'benin',
    
    # Bhután
    'bhutanese': 'bhutan',
    'bhutan': 'bhutan',
    
    # Bolivia
    'bolivian': 'bolivia',
    'bolivia': 'bolivia',
    
    # Bosnia y Herzegovina
    'bosnian': 'bosnia_and_herzegovina',
    'bosnia_and_herzegovina': 'bosnia_and_herzegovina',
    
    # Botswana
    'botswanan': 'botswana',
    'botswana': 'botswana',
    
    # Brasil
    'brazilian': 'brazil',
    'brazil': 'brazil',
    
    # Brunei
    'bruneian': 'brunei',
    'brunei': 'brunei',
    
    # Bulgaria
    'bulgarian': 'bulgaria',
    'bulgaria': 'bulgaria',
    
    # Burkina Faso
    'burkinabe': 'burkina_faso',
    'burkina_faso': 'burkina_faso',
    
    # Burundi
    'burundian': 'burundi',
    'burundi': 'burundi',
    
    # Camboya
    'cambodian': 'cambodia',
    'cambodia': 'cambodia',
    
    # Camerún
    'cameroonian': 'cameroon',
    'cameroon': 'cameroon',
    
    # Canadá
    'canadian': 'canada',
    'canada': 'canada',
    
    # Cabo Verde
    'cape_verdean': 'cape_verde',
    'cape_verde': 'cape_verde',
    
    # República Centroafricana
    'central_african': 'central_african_republic',
    'central_african_republic': 'central_african_republic',
    
    # Chad
    'chadian': 'chad',
    'chad': 'chad',
    
    # Chile
    'chilean': 'chile',
    'chile': 'chile',
    
    # China
    'chinese': 'china',
    'china': 'china',
    
    # Colombia
    'colombian': 'colombia',
    'colombia': 'colombia',
    
    # Comoras
    'comorian': 'comoros',
    'comoros': 'comoros',
    
    # Congo
    'congolese': 'congo',
    'congo': 'congo',
    
    # Costa Rica
    'costa_rican': 'costa_rica',
    'costa_rica': 'costa_rica',
    
    # Croacia
    'croatian': 'croatia',
    'croatia': 'croatia',
    
    # Cuba
    'cuban': 'cuba',
    'cuba': 'cuba',
    
    # Chipre
    'cypriot': 'cyprus',
    'cyprus': 'cyprus',
    
    # República Checa
    'czech': 'czech_republic',
    'czech_republic': 'czech_republic',
    
    # Dinamarca
    'danish': 'denmark',
    'denmark': 'denmark',
    
    # Yibuti
    'djiboutian': 'djibouti',
    'djibouti': 'djibouti',
    
    # Dominica
    'dominican': 'dominica',
    'dominica': 'dominica',
    
    # República Dominicana
    'dominican_republic': 'dominican_republic',
    
    # Timor Oriental
    'east_timorese': 'east_timor',
    'east_timor': 'east_timor',
    
    # Ecuador
    'ecuadorian': 'ecuador',
    'ecuador': 'ecuador',
    
    # Egipto
    'egyptian': 'egypt',
    'egypt': 'egypt',
    
    # El Salvador
    'salvadoran': 'el_salvador',
    'el_salvador': 'el_salvador',
    
    # Guinea Ecuatorial
    'equatorial_guinean': 'equatorial_guinea',
    'equatorial_guinea': 'equatorial_guinea',
    
    # Eritrea
    'eritrean': 'eritrea',
    'eritrea': 'eritrea',
    
    # Estonia
    'estonian': 'estonia',
    'estonia': 'estonia',
    
    # Etiopía
    'ethiopian': 'ethiopia',
    'ethiopia': 'ethiopia',
    
    # Fiji
    'fijian': 'fiji',
    'fiji': 'fiji',
    
    # Finlandia
    'finnish': 'finland',
    'finland': 'finland',
    
    # Francia
    'french': 'france',
    'france': 'france',
    
    # Gabón
    'gabonese': 'gabon',
    'gabon': 'gabon',
    
    # Gambia
    'gambian': 'gambia',
    'gambia': 'gambia',
    
    # Georgia
    'georgian': 'georgia',
    'georgia': 'georgia',
    
    # Alemania
    'german': 'germany',
    'germany': 'germany',
    
    # Ghana
    'ghanaian': 'ghana',
    'ghana': 'ghana',
    
    # Grecia
    'greek': 'greece',
    'greece': 'greece',
    
    # Granada
    'grenadian': 'grenada',
    'grenada': 'grenada',
    
    # Guatemala
    'guatemalan': 'guatemala',
    'guatemala': 'guatemala',
    
    # Guinea
    'guinean': 'guinea',
    'guinea': 'guinea',
    
    # Guinea-Bissau
    'bissau_guinean': 'guinea_bissau',
    'guinea_bissau': 'guinea_bissau',
    
    # Guyana
    'guyanese': 'guyana',
    'guyana': 'guyana',
    
    # Haití
    'haitian': 'haiti',
    'haiti': 'haiti',
    
    # Honduras
    'honduran': 'honduras',
    'honduras': 'honduras',
    
    # Hungría
    'hungarian': 'hungary',
    'hungary': 'hungary',
    
    # Islandia
    'icelandic': 'iceland',
    'iceland': 'iceland',
    
    # India
    'indian': 'india',
    'india': 'india',
    
    # Indonesia
    'indonesian': 'indonesia',
    'indonesia': 'indonesia',
    
    # Irán
    'iranian': 'iran',
    'iran': 'iran',
    
    # Iraq
    'iraqi': 'iraq',
    'iraq': 'iraq',
    
    # Irlanda
    'irish': 'ireland',
    'ireland': 'ireland',
    
    # Israel
    'israeli': 'israel',
    'israel': 'israel',
    
    # Italia
    'italian': 'italy',
    'italy': 'italy',
    
    # Jamaica
    'jamaican': 'jamaica',
    'jamaica': 'jamaica',
    
    # Japón
    'japanese': 'japan',
    'japan': 'japan',
    
    # Jordania
    'jordanian': 'jordan',
    'jordan': 'jordan',
    
    # Kazajistán
    'kazakh': 'kazakhstan',
    'kazakhstan': 'kazakhstan',
    
    # Kenia
    'kenyan': 'kenya',
    'kenya': 'kenya',
    
    # Kiribati
    'i_kiribati': 'kiribati',
    'kiribati': 'kiribati',
    
    # Corea del Norte
    'north_korean': 'north_korea',
    'north_korea': 'north_korea',
    
    # Corea del Sur
    'south_korean': 'south_korea',
    'south_korea': 'south_korea',
    
    # Kuwait
    'kuwaiti': 'kuwait',
    'kuwait': 'kuwait',
    
    # Kirguistán
    'kyrgyz': 'kyrgyzstan',
    'kyrgyzstan': 'kyrgyzstan',
    
    # Laos
    'laotian': 'laos',
    'laos': 'laos',
    
    # Letonia
    'latvian': 'latvia',
    'latvia': 'latvia',
    
    # Líbano
    'lebanese': 'lebanon',
    'lebanon': 'lebanon',
    
    # Lesoto
    'basotho': 'lesotho',
    'lesotho': 'lesotho',
    
    # Liberia
    'liberian': 'liberia',
    'liberia': 'liberia',
    
    # Libia
    'libyan': 'libya',
    'libya': 'libya',
    
    # Liechtenstein
    'liechtensteiner': 'liechtenstein',
    'liechtenstein': 'liechtenstein',
    
    # Lituania
    'lithuanian': 'lithuania',
    'lithuania': 'lithuania',
    
    # Luxemburgo
    'luxembourger': 'luxembourg',
    'luxembourg': 'luxembourg',
    
    # Macedonia del Norte
    'macedonian': 'north_macedonia',
    'north_macedonia': 'north_macedonia',
    
    # Madagascar
    'malagasy': 'madagascar',
    'madagascar': 'madagascar',
    
    # Malawi
    'malawian': 'malawi',
    'malawi': 'malawi',
    
    # Malasia
    'malaysian': 'malaysia',
    'malaysia': 'malaysia',
    
    # Maldivas
    'maldivian': 'maldives',
    'maldives': 'maldives',
    
    # Mali
    'malian': 'mali',
    'mali': 'mali',
    
    # Malta
    'maltese': 'malta',
    'malta': 'malta',
    
    # Islas Marshall
    'marshallese': 'marshall_islands',
    'marshall_islands': 'marshall_islands',
    
    # Mauritania
    'mauritanian': 'mauritania',
    'mauritania': 'mauritania',
    
    # Mauricio
    'mauritian': 'mauritius',
    'mauritius': 'mauritius',
    
    # México
    'mexican': 'mexico',
    'mexico': 'mexico',
    
    # Micronesia
    'micronesian': 'micronesia',
    'micronesia': 'micronesia',
    
    # Moldavia
    'moldovan': 'moldova',
    'moldova': 'moldova',
    
    # Mónaco
    'monacan': 'monaco',
    'monaco': 'monaco',
    
    # Mongolia
    'mongolian': 'mongolia',
    'mongolia': 'mongolia',
    
    # Montenegro
    'montenegrin': 'montenegro',
    'montenegro': 'montenegro',
    
    # Marruecos
    'moroccan': 'morocco',
    'morocco': 'morocco',
    
    # Mozambique
    'mozambican': 'mozambique',
    'mozambique': 'mozambique',
    
    # Myanmar (Birmania)
    'myanmar': 'myanmar',
    'burmese': 'myanmar',
    
    # Namibia
    'namibian': 'namibia',
    'namibia': 'namibia',
    
    # Nauru
    'nauruan': 'nauru',
    'nauru': 'nauru',
    
    # Nepal
    'nepalese': 'nepal',
    'nepali': 'nepal',
    'nepal': 'nepal',
    
    # Países Bajos
    'dutch': 'netherlands',
    'netherlands': 'netherlands',
    
    # Nueva Zelanda
    'new_zealander': 'new_zealand',
    'new_zealand': 'new_zealand',
    
    # Nicaragua
    'nicaraguan': 'nicaragua',
    'nicaragua': 'nicaragua',
    
    # Níger
    'nigerien': 'niger',
    'niger': 'niger',
    
    # Nigeria
    'nigerian': 'nigeria',
    'nigeria': 'nigeria',
    
    # Noruega
    'norwegian': 'norway',
    'norway': 'norway',
    
    # Omán
    'omani': 'oman',
    'oman': 'oman',
    
    # Pakistán
    'pakistani': 'pakistan',
    'pakistan': 'pakistan',
    
    # Palau
    'palauan': 'palau',
    'palau': 'palau',
    
    # Palestina
    'palestinian': 'palestine',
    'palestine': 'palestine',
    
    # Panamá
    'panamanian': 'panama',
    'panama': 'panama',
    
    # Papúa Nueva Guinea
    'papua_new_guinean': 'papua_new_guinea',
    'papua_new_guinea': 'papua_new_guinea',
    
    # Paraguay
    'paraguayan': 'paraguay',
    'paraguay': 'paraguay',
    
    # Perú
    'peruvian': 'peru',
    'peru': 'peru',
    
    # Filipinas
    'filipino': 'philippines',
    'philippines': 'philippines',
    
    # Polonia
    'polish': 'poland',
    'poland': 'poland',
    
    # Portugal
    'portuguese': 'portugal',
    'portugal': 'portugal',
    
    # Qatar
    'qatari': 'qatar',
    'qatar': 'qatar',
    
    # Rumania
    'romanian': 'romania',
    'romania': 'romania',
    
    # Rusia
    'russian': 'russia',
    'russia': 'russia',
    
    # Ruanda
    'rwandan': 'rwanda',
    'rwanda': 'rwanda',
    
    # San Cristóbal y Nieves
    'kittitian': 'saint_kitts_and_nevis',
    'saint_kitts_and_nevis': 'saint_kitts_and_nevis',
    
    # Santa Lucía
    'saint_lucian': 'saint_lucia',
    'saint_lucia': 'saint_lucia',
    
    # San Vicente y las Granadinas
    'vincentian': 'saint_vincent_and_the_grenadines',
    'saint_vincent_and_the_grenadines': 'saint_vincent_and_the_grenadines',
    
    # Samoa
    'samoan': 'samoa',
    'samoa': 'samoa',
    
    # San Marino
    'sammarinese': 'san_marino',
    'san_marino': 'san_marino',
    
    # Santo Tomé y Príncipe
    'sao_tomean': 'sao_tome_and_principe',
    'sao_tome_and_principe': 'sao_tome_and_principe',
    
    # Arabia Saudita
    'saudi': 'saudi_arabia',
    'saudi_arabia': 'saudi_arabia',
    
    # Senegal
    'senegalese': 'senegal',
    'senegal': 'senegal',
    
    # Serbia
    'serbian': 'serbia',
    'serbia': 'serbia',
    
    # Seychelles
    'seychellois': 'seychelles',
    'seychelles': 'seychelles',
    
    # Sierra Leona
    'sierra_leonean': 'sierra_leone',
    'sierra_leone': 'sierra_leone',
    
    # Singapur
    'singaporean': 'singapore',
    'singapore': 'singapore',
    
    # Eslovaquia
    'slovak': 'slovakia',
    'slovakia': 'slovakia',
    
    # Eslovenia
    'slovenian': 'slovenia',
    'slovenia': 'slovenia',
    
    # Islas Salomón
    'solomon_islander': 'solomon_islands',
    'solomon_islands': 'solomon_islands',
    
    # Somalia
    'somali': 'somalia',
    'somalia': 'somalia',
    
    # Sudáfrica
    'south_african': 'south_africa',
    'south_africa': 'south_africa',
    
    # Sudán del Sur
    'south_sudanese': 'south_sudan',
    'south_sudan': 'south_sudan',
    
    # España
    'spanish': 'spain',
    'spain': 'spain',
    
    # Sri Lanka
    'sri_lankan': 'sri_lanka',
    'sri_lanka': 'sri_lanka',
    
    # Sudán
    'sudanese': 'sudan',
    'sudan': 'sudan',
    
    # Surinam
    'surinamese': 'suriname',
    'suriname': 'suriname',
    
    # Suecia
    'swedish': 'sweden',
    'sweden': 'sweden',
    
    # Suiza
    'swiss': 'switzerland',
    'switzerland': 'switzerland',
    
    # Siria
    'syrian': 'syria',
    'syria': 'syria',
    
    # Taiwán
    'taiwanese': 'taiwan',
    'taiwan': 'taiwan',
    
    # Tayikistán
    'tajik': 'tajikistan',
    'tajikistan': 'tajikistan',
    
    # Tanzania
    'tanzanian': 'tanzania',
    'tanzania': 'tanzania',
    
    # Tailandia
    'thai': 'thailand',
    'thailand': 'thailand',
    
    # Togo
    'togolese': 'togo',
    'togo': 'togo',
    
    # Tonga
    'tongan': 'tonga',
    'tonga': 'tonga',
    
    # Trinidad y Tobago
    'trinidadian': 'trinidad_and_tobago',
    'trinidad_and_tobago': 'trinidad_and_tobago',
    
    # Túnez
    'tunisian': 'tunisia',
    'tunisia': 'tunisia',
    
    # Turquía
    'turkish': 'turkey',
    'turkey': 'turkey',
    
    # Turkmenistán
    'turkmen': 'turkmenistan',
    'turkmenistan': 'turkmenistan',
    
    # Tuvalu
    'tuvaluan': 'tuvalu',
    'tuvalu': 'tuvalu',
    
    # Uganda
    'ugandan': 'uganda',
    'uganda': 'uganda',
    
    # Ucrania
    'ukrainian': 'ukraine',
    'ukraine': 'ukraine',
    
    # Emiratos Árabes Unidos
    'emirati': 'united_arab_emirates',
    'united_arab_emirates': 'united_arab_emirates',
    
    # Variaciones para inglés/británico
    "english": "united_kingdom",
    "british": "united_kingdom",
    "uk": "united_kingdom",
    "united_kingdom": "united_kingdom",

    # Ciudades UK
    "london": "united_kingdom",
    "manchester": "united_kingdom",
    "liverpool": "united_kingdom",
    "birmingham": "united_kingdom",
    "leeds": "united_kingdom",
    "glasgow": "united_kingdom",
    "edinburgh": "united_kingdom",
    "cardiff": "united_kingdom",
    "belfast": "united_kingdom",
    "sheffield": "united_kingdom",
    "bristol": "united_kingdom",
    "oxford": "united_kingdom",
    "nottingham": "united_kingdom",
    "leicester": "united_kingdom",
    "coventry": "united_kingdom",
    "peterborough": "united_kingdom",
    "wolverhampton": "united_kingdom",
    "swansea": "united_kingdom",
    "newcastle": "united_kingdom",
    "bournemouth": "united_kingdom",
    "brighton": "united_kingdom",
    "milton_keynes": "united_kingdom",
   
    
    # Variaciones para americano/estadounidense
    "american": "united_states",
    "usa": "united_states",
    "us": "united_states",
    "united_states": "united_states",

    # Ciudades USA
    "new_york": "united_states",
    "nyc": "united_states",
    "los_angeles": "united_states",
    "la": "united_states",
    "chicago": "united_states",
    "houston": "united_states",
    "miami": "united_states",
    "boston": "united_states",
    "seattle": "united_states",
    "san_francisco": "united_states",
    "las_vegas": "united_states",
    "washington": "united_states",
    "dallas": "united_states",
    "atlanta": "united_states",
    "philadelphia": "united_states",
    "san_diego": "united_states",
    "san_jose": "united_states",
    "austin": "united_states",
    "san_antonio": "united_states",
   


    # Reino Unido
    'british': 'united_kingdom',
    'uk': 'united_kingdom',
    'english': 'united_kingdom',
    'scottish': 'united_kingdom',
    'welsh': 'united_kingdom',
    'united_kingdom': 'united_kingdom',
    
    # Estados Unidos
    'american': 'united_states',
    'usa': 'united_states',
    'us': 'united_states',
    'united_states': 'united_states',
    
    # Uruguay
    'uruguayan': 'uruguay',
    'uruguay': 'uruguay',
    
    # Uzbekistán
    'uzbek': 'uzbekistan',
    'uzbekistan': 'uzbekistan',
    
    # Vanuatu
    'ni_vanuatu': 'vanuatu',
    'vanuatu': 'vanuatu',
    
    # Ciudad del Vaticano
    'vatican': 'vatican_city',
    'vatican_city': 'vatican_city',
    
    # Venezuela
    'venezuelan': 'venezuela',
    'venezuela': 'venezuela',
    
    # Vietnam
    'vietnamese': 'vietnam',
    'vietnam': 'vietnam',
    
    # Yemen
    'yemeni': 'yemen',
    'yemen': 'yemen',
    
    # Zambia
    'zambian': 'zambia',
    'zambia': 'zambia',
    
    # Zimbabue
    'zimbabwean': 'zimbabwe',
    'zimbabwe': 'zimbabwe'
}
# Añadir al inicio del archivo, junto a los otros mapeos
generic_person_words = {
    'singular': [
        'woman', 'man', 'person', 'girl', 'boy', 'lady', 'gentleman',
        'female', 'male', 'human', 'guy', 'dude', 'child', 'kid'
    ],
    'plural': [
        'women', 'men', 'people', 'girls', 'boys', 'ladies', 'gentlemen',
        'humans', 'guys', 'dudes', 'children', 'kids', 'group', 'couple'
    ]
}

racial_keywords = {
    'white_european': ['blonde', 'blond', 'fair', 'pale', 'caucasian'],
    'african': ['black', 'african', 'dark_skinned'],
    'asian': ['asian', 'oriental'],
    'latin_american': ['latino', 'latina', 'hispanic'],
    'middle_eastern': ['arab', 'arabic', 'middle_eastern'],
    'south_asian': ['indian', 'pakistani', 'desi']
}

# Definir palabras clave para género
FEMALE_WORDS = ["woman", "girl", "female", "she", "her", "lady", "feminine"]
MALE_WORDS = ["man", "boy", "male", "he", "his", "gentleman", "masculine"]

def get_random_features(racial_group=None):
    """Obtiene características aleatorias, opcionalmente de un grupo racial específico"""
    try:
        if racial_group:
            ethnic_type = ethnic_data['ethnic_types'].get(racial_group)
        else:
            # Seleccionar grupo étnico aleatorio
            available_types = list(ethnic_data['ethnic_types'].keys())
            ethnic_type = ethnic_data['ethnic_types'][random.choice(available_types)]
        
        if not ethnic_type:
            return None
            
        # Obtener características físicas aleatorias
        size_features = get_random_size_features()
        
        return {
            'skin_tone': random.choice(ethnic_type['features']['skin_tones']),
            'hair_color': random.choice(ethnic_type['features']['hair_colors']),
            'eye_color': random.choice(ethnic_type['features']['eye_colors']),
            'facial_features': ethnic_type['features']['facial_features'],
            'ethnic_description': f"with {racial_group.replace('_', ' ') if racial_group else 'diverse'} features",
            'build': size_features
        }
    except Exception as e:
        print(f"Error getting random features: {str(e)}")
        return None

# Main function to transform prompts
def transform_prompt(prompt_text, use_openai=False):
    print(f"🔄 Processing prompt: {prompt_text} (OpenAI: {use_openai})")
    
    try:
        # Cargar ambos archivos JSON (mantener por compatibilidad)
        with open('static/ethnic.json', 'r', encoding='utf-8') as f:
            ethnic_data = json.load(f)
        with open('static/sizes.json', 'r', encoding='utf-8') as f:
            size_data = json.load(f)
    except Exception as e:
        print(f"❌ Error loading data files: {str(e)}")
        return f"{prompt_text}, "

    words = prompt_text.lower().split()

    # 1. Primero buscar palabras clave raciales
    for word in words:
        for racial_group, keywords in racial_keywords.items():
            if word in keywords:
                features = get_random_features(racial_group)
                if features:
                    ethnic_prompt = f"{prompt_text}, average looking person with {features['skin_tone']} skin, {features['hair_color']} hair, {features['eye_color']} eyes, and common facial features including {', '.join(features['facial_features'])}, {features['ethnic_description']}, casual appearance, everyday person, candid pose, natural lighting"
                    return generate_openai_prompt(ethnic_prompt) if use_openai else f"{ethnic_prompt}, "

    # 2. Mantener la lógica existente de nacionalidad
    detected_nationality = None
    for nationality in nationality_mapping:
        if nationality in words:
            detected_nationality = nationality_mapping[nationality]
            print(f"✅ Detected nationality: {nationality} -> {detected_nationality}")
            break

    if detected_nationality:
        characteristics = get_ethnic_characteristics(detected_nationality, ethnic_data)
        if characteristics:
            gender = 'male' if any(word in words for word in MALE_WORDS) else \
                    'female' if any(word in words for word in FEMALE_WORDS) else \
                    'female'
            print(f"✅ Detected gender: {gender}")
            
            size_desc = get_size_characteristics(detected_nationality, gender, size_data)
            if size_desc:
                print(f"✅ Size characteristics: {size_desc}")
                size_text = f", {size_desc}"
            else:
                print("❌ No size data found")
                size_text = ""
            
            ethnic_prompt = f"{prompt_text}, average looking person with {characteristics['skin_tone']} skin{size_text}, {characteristics['hair_color']} hair, {characteristics['eye_color']} eyes, and common facial features including {', '.join(characteristics['facial_features'])}, {characteristics['ethnic_description']}, casual appearance, everyday person, candid pose, natural lighting"
            return generate_openai_prompt(ethnic_prompt) if use_openai else f"{ethnic_prompt}, "

    # 3. Si no hay nacionalidad ni palabra racial, buscar palabras genéricas de persona
    for word in words:
        if word in generic_person_words['singular'] or word in generic_person_words['plural']:
            features = get_random_features()
            if features:
                ethnic_prompt = f"{prompt_text}, average looking person with {features['skin_tone']} skin, {features['hair_color']} hair, {features['eye_color']} eyes, and common facial features including {', '.join(features['facial_features'])}, {features['ethnic_description']}, casual appearance, everyday person, candid pose, natural lighting"
                return generate_openai_prompt(ethnic_prompt) if use_openai else f"{ethnic_prompt}, "

    # Si no hay matches, mantener comportamiento original
    if use_openai:
        enhanced_prompt = generate_openai_prompt(prompt_text)
        return f"{enhanced_prompt}, " if enhanced_prompt else f"{prompt_text}, "
    
    return f"{prompt_text}, "


def get_ethnic_characteristics(country, ethnic_data):
    """Selecciona características étnicas basadas en probabilidades demográficas"""
    
    # Obtener datos del país
    country_data = ethnic_data['countries'].get(country)
    if not country_data:
        print(f"❌ No data found for {country}")
        return None

    # Convertir etnias a lista con sus porcentajes
    ethnicities = []
    for name, percentage in country_data['ethnicities'].items():
        ethnic_type = country_data['ethnic_references'].get(name)
        if ethnic_type in ethnic_data['ethnic_types']:
            ethnicities.append({
                'name': name,
                'percentage': float(percentage),
                'features': ethnic_data['ethnic_types'][ethnic_type]['features'],
                'ethnic_type': ethnic_type
            })

    if not ethnicities:
        return None

    # Seleccionar etnia basada en porcentajes
    weights = [e['percentage'] for e in ethnicities]
    selected = random.choices(ethnicities, weights=weights, k=1)[0]
    print(f"✅ Selected ethnicity: {selected['name']} ({selected['percentage']}%)")

    # Seleccionar características aleatorias de la etnia seleccionada
    return {
        'skin_tone': random.choice(selected['features']['skin_tones']),
        'hair_color': random.choice(selected['features']['hair_colors']),
        'eye_color': random.choice(selected['features']['eye_colors']),
        'facial_features': selected['features']['facial_features'],
        'ethnic_description': f"of {selected['ethnic_type'].replace('_', ' ')} heritage with {selected['ethnic_type'].replace('_', ' ')} features"
    }

def generate_openai_prompt(prompt_text):
    """Mejora el prompt usando OpenAI manteniendo las características étnicas"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
             messages=[
                {"role": "system", "content": """You are a helpful assistant that enhances image generation prompts. 
                When the prompt includes a nationality, you MUST:
                1. Detect the nationality and include appropriate ethnic features
                2. Use skin tones, hair colors, eye colors typical of that ethnicity
                3. Include appropriate facial features
                4. Keep descriptions respectful and accurate
                
                For all prompts:
                1. Enhance visual details
                2. Keep language clear and direct
                3. Focus on visual elements
                4. Maintain the original intent"""},
                {"role": "user", "content": f"Enhance this image generation prompt: {prompt_text}"}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        if response and response.choices and len(response.choices) > 0:
            return response.choices[0].message.content
        return None
    except Exception as e:
        print(f"❌ Error with OpenAI: {str(e)}")
        return None

@app.route('/gpt-talk', methods=['POST'])
def gpt_talk():
    data = request.json
    user_message = data.get('message')
    conversation = data.get('conversation', [])
    image_data = data.get('image')  # Esperamos que la imagen se envíe como base64

    if not user_message and not image_data:
        return jsonify({"error": "No image given"}), 400

    try:
        # Preparamos el historial de mensajes para enviar a la API
        messages = [
            {"role": "system", "content": "You are an expert in writing detailed and effective prompts for AI image generation. You help users create creative and accurate prompts that can be used in AI image generation tools. When an image is provided, you can also analyse it in detail.."}
        ]

        # Añadimos los mensajes previos del historial de conversación
        for msg in conversation:
            messages.append({
                "role": msg['role'],  # 'user' o egg 'assistant'
                "content": msg['content']
            })

        # Preparamos el contenido del nuevo mensaje
        new_message_content = []
        if user_message:
            new_message_content.append({"type": "text", "text": user_message})

        if image_data:
            new_message_content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_data}",
                    "detail": "high"
                }
            })
            if not user_message:
                user_message = "Analyse this image in detail, describing its content, colour, composition, style, lighting, angle and other relevant elements. Then suggest a detailed prompt to generate a similar image."
            else:
                user_message += " In addition, it analyses the image provided and suggests how to improve the prompt based on it."

        # Añadimos el nuevo mensaje del usuario
        messages.append({"role": "user", "content": new_message_content if image_data else user_message})

        # Llamada a la API de OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo" if image_data else "gpt-4-turbo",
            messages=messages,
            temperature=1,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        # Devolver la respuesta generada por GPT
        return jsonify({"response": response['choices'][0]['message']['content']})
    
    except openai.error.OpenAIError as e:
        return jsonify({"error": f"Error de la API de OpenAI: {str(e)}"}), 500

    
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


@app.route('/openai/transform', methods=['POST'])
def transform_prompt_endpoint():
    data = request.json
    prompt = data.get('prompt', '')
    use_openai = data.get('use_openai', False)
    
    transformed_prompt = transform_prompt(prompt, use_openai)
    return jsonify({'transformed_prompt': transformed_prompt})



@app.route('/generate-images', methods=['POST'])
def generate_images():
    try:
        if 'username' not in session:
            return jsonify({"error": "Not logged in"}), 401

        username = session['username']
        user_data = get_user_data(username)

        if user_data and user_data.get('credits', 0) >= 4:
            data = request.get_json()

            prompt_text = data.get('prompt')
            use_openai = data.get('use_openai', True)  # Obtener el estado del switch

            if not prompt_text:
                return jsonify({"error": "Missing prompt text"}), 400

            # Decidir si transformar el prompt según el estado del switch
            transformed_prompt = (
                transform_prompt(prompt_text, use_openai)
            )

            data['prompt'] = transformed_prompt
            data['negative_prompt'] = "cleft chin, professional model, perfect features, glamour, magazine style, fashion model, advertisement, perfect symmetry, flawless skin, perfect makeup, perfect teeth, high fashion, beauty standards, instagram filter, photoshoot, studio lighting"
            if 'key' in data:
                del data['key']

            data['key'] = 'X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw'
            url = (
                'https://modelslab.com/api/v6/images/img2img'
                if 'init_image' in data
                else 'https://modelslab.com/api/v6/images/text2img'
            )

            response = requests.post(url, json=data, timeout=180)

            if response.status_code == 200:
                result = response.json()

                if result.get('status') == 'success' and result.get('output'):
                    deduct_credits(username, 4)
                    session['credits'] -= 4
                    return jsonify({
                        "images": result.get('output'),
                        "transformed_prompt": transformed_prompt,
                        "credits": session['credits']
                    }), 200

                elif result.get('status') == 'processing' and result.get('id'):
                    return jsonify({
                        "message": "La generación de imágenes está en proceso.",
                        "request_id": result.get('id'),
                        "eta": result.get('eta'),
                        "transformed_prompt": transformed_prompt
                    }), 202

                else:
                    return jsonify({"error": "Unexpected service response", "details": result}), 500

            else:
                return jsonify({"error": "Image generation failed", "details": response.text}), response.status_code

        elif user_data and user_data.get('credits', 0) <= 3:
            return jsonify({"error": "Insufficient credits", "redirect": "https://www.google.com"}), 403

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timed out. Try again."}), 504

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

    
    
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



#ultra
# Clave API almacenada directamente
API_KEY = 'X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw'

@app.route('/get-api-key', methods=['GET'])
def get_api_key():
    # Opcionalmente, verifica que el usuario esté autenticado
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({'api_key': API_KEY})


@app.route('/proxy/super-resolution', methods=['POST'])
def proxy_super_resolution():
    url = "https://modelslab.com/api/v6/image_editing/super_resolution"
    headers = {"Content-Type": "application/json"}
    payload = request.json
    payload['key'] = API_KEY  # Asegúrate de agregar la clave API

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/proxy/fetch/<int:fetch_id>', methods=['POST'])
def proxy_fetch_with_propagation_check(fetch_id):
    url = f"https://modelslab.com/api/v6/image_editing/fetch/{fetch_id}"
    headers = {"Content-Type": "application/json"}
    payload = {"key": API_KEY}

    max_retries = 60  # Aumenta a 60 intentos
    delay = 5  # Aumenta a 5 segundos entre intentos

    try:
        for attempt in range(max_retries):
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            if response.ok:
                data = response.json()
                if data.get('status') == 'success' and data.get('output'):
                    return jsonify(data), response.status_code
                elif data.get('status') == 'processing':
                    print(f"Attempt {attempt + 1}: Image still processing. Retrying...")
                    time.sleep(delay)
                else:
                    print(f"Unexpected status: {data.get('status')}")
                    break
            else:
                response.raise_for_status()

        return jsonify({"error": "Image not available after retries"}), 504
    except requests.RequestException as req_err:
        print(f"Request error occurred: {req_err}")
        return jsonify({"error": f"Request error: {req_err}"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


    
@app.route('/sweater')
def sweater_page():
    return render_template('sweater.html')

@app.route('/api/virtual-try-on', methods=['POST'])
def sweater():
    try:
        # Verificar que se recibieron datos JSON
        if not request.is_json:
            return jsonify({"error": "Se requiere contenido JSON"}), 400

        data = request.json
        
        # Validar datos requeridos
        if not data.get('init_image') or not data.get('cloth_image'):
            return jsonify({"error": "Se requieren imágenes de inicio y de ropa"}), 400

        # Agregar la clave API de ModelsLab
        data['key'] = 'X0qYOcbNktuRv1ri0A8VK1WagXs9vNjpEBLfO8SnRRQhN0iWym8pOrH1dOMw'

        # Enviar solicitud a la API de ModelsLab con timeout
        modelslab_url = 'https://modelslab.com/api/v6/image_editing/fashion'
        response = requests.post(modelslab_url, json=data, timeout=30)

        response_data = response.json()

        if response.status_code == 200:
            return jsonify(response_data), 200
        else:
            return jsonify({
                "error": response_data.get("error", "Error desconocido"),
                "status_code": response.status_code
            }), response.status_code

    except requests.Timeout:
        return jsonify({"error": "Tiempo de espera agotado"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    

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

#templates html regular
@app.route('/adem-guide')
def adem_guide():
    return render_template('adem-guide.html')


@app.route('/logout')
def logout():
    # Clear all data stored in the session
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)

# Al inicio del archivo, cargar una sola vez
with open('static/ethnic.json', 'r', encoding='utf-8') as f:
    ethnic_data = json.load(f)

def get_ethnic_characteristics(country, ethnic_data):
    country_data = ethnic_data['countries'].get(country)
    if not country_data:
        return None
        
    ethnicities = []
    for name, percentage in country_data['ethnicities'].items():
        ethnic_type = country_data['ethnic_references'].get(name)
        if ethnic_type in ethnic_data['ethnic_types']:
            ethnicities.append({
                'name': name,
                'percentage': float(percentage),
                'features': ethnic_data['ethnic_types'][ethnic_type]['features'],
                'ethnic_type': ethnic_type
            })
    
    if not ethnicities:
        return None
        
    # Seleccionar etnia basada en porcentajes
    weights = [e['percentage'] for e in ethnicities]
    selected = random.choices(ethnicities, weights=weights, k=1)[0]
    
    return {
        'skin_tone': random.choice(selected['features']['skin_tones']),
        'hair_color': random.choice(selected['features']['hair_colors']),
        'eye_color': random.choice(selected['features']['eye_colors']),
        'facial_features': selected['features']['facial_features'],
        'ethnic_description': f"of {selected['ethnic_type'].replace('_', ' ')} heritage with {selected['ethnic_type'].replace('_', ' ')} features"
    }



@app.route('/persona', methods=['GET'])
def persona():
    return render_template('persona.html')

@app.route('/generate-persona', methods=['POST'])
def generate_persona():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        film_type = data.get('film_type')
        use_ai_prompt = data.get('use_ai_prompt', True)
        
        # Configuración según el tipo de película
        film_configs = {
            'fuji': {
                'version': "f43477e89617ab7bc66f93731b5027d6e46c116ff7b7dce7f5ffccb39a01b375",
                'keyword': "TOK"
            },
            'koda': {
                'version': "1ba00ff40b6f4b603d1126bca1c75da7f0f9ff21eb1569e9adb4299c9f3e1166",
                'keyword': "TOK"
            },
            'surreal': {
                'version': "af9441cdc4a371dece5fbe6144d4587ccb68d7b00c2d573b206254180691f895",
                'keyword': "surreal style"
            },
            'pola': {
                'version': "67c27855ad0334cbca0f35cd5192777d885d5351e1d3e7149fe208d88db51bad",
                'keyword': "polaroid style"
            },
            'analog': {
                'version': "e489fed94f07ffa8037d3d31cc40e8539ea37f6a5d5275747eff6be384e511cb",
                'keyword': "ANLG",
                'params': {
                    "negative_prompt": "cleft chin, professional model, perfect features, glamour, magazine style, fashion model, advertisement, perfect symmetry, flawless skin, perfect makeup, perfect teeth, high fashion, beauty standards, instagram filter, photoshoot, studio lighting",
                    "width": 768,
                    "height": 768,
                    "num_inference_steps": 28,
                    "guidance_scale": 7.5,
                    "model": "dev",
                    "lora_scale": 1,
                    "extra_lora_scale": 1
                }
            },
            'disposable': {
                'version': "4c851c9ca3c1167df599c400a277dc2b20b0ad166afc5c5d691e5bb64c46c254",
                'keyword': "DISP",
                'params': {
                    "negative_prompt": "cleft chin, professional model, perfect features, glamour, magazine style, fashion model, advertisement, perfect symmetry, flawless skin, perfect makeup, perfect teeth, high fashion, beauty standards, instagram filter, photoshoot, studio lighting",
                    "width": 768,
                    "height": 768,
                    "num_inference_steps": 28,
                    "guidance_scale": 7.5,
                    "model": "dev",
                    "lora_scale": 1,
                    "extra_lora_scale": 1
                }
            },
            'flux': {
                'version': "39b3434f194f87a900d1bc2b6d4b983e90f0dde1d5022c27b52c143d670758fa",
                'keyword': "FLUX",
                'params': {
                    "prompt": "",  # Se llenará con el prompt generado
                    "negative_prompt": "cleft chin, professional model, perfect features, glamour, magazine style, fashion model, advertisement, perfect symmetry, flawless skin, perfect makeup, perfect teeth, high fashion, beauty standards, instagram filter, photoshoot, studio lighting",
                    "width": 768,
                    "height": 768,
                    "num_inference_steps": 30,
                    "guidance_scale": 7.5,
                    "seed": -1,  # -1 para aleatorio
                    "num_outputs": 1,
                    "scheduler": "DPM++ 2M Karras"
                }
            }
        }

        if film_type not in film_configs:
            raise Exception("Invalid film type selected")

        config = film_configs[film_type]
        enhanced_prompt = transform_prompt(prompt, use_openai=use_ai_prompt)
        final_prompt = f"{enhanced_prompt}, {config['keyword']}"

        # Preparar los parámetros según el modelo
        if film_type in ['analog', 'disposable', 'flux']:  # Añadimos 'flux' aquí

            input_params = config['params'].copy()
            input_params['prompt'] = final_prompt
        else:
            input_params = {
                "prompt": final_prompt,
                "num_outputs": 1,
                "guidance_scale": 2,
                "num_inference_steps": 28
            }

        response = requests.post(
            "https://api.replicate.com/v1/predictions",
            json={
                "version": config['version'],
                "input": input_params
            },
            headers={
                "Authorization": f"Token {os.environ['REPLICATE_API_TOKEN']}",
                "Content-Type": "application/json"
            }
        )

        if response.status_code != 201:
            print(f"Error response: {response.text}")
            raise Exception(f"Error creating prediction: {response.status_code}")
            
        prediction = response.json()
        prediction_id = prediction['id']
        
        # Polling para cada imagen
        while True:
            response = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers={
                    "Authorization": f"Token {os.environ['REPLICATE_API_TOKEN']}",
                    "Content-Type": "application/json"
                }
            )
            prediction = response.json()
            

            if prediction['status'] == 'succeeded':
                return jsonify({
                "status": "succeeded",
                "image_url": prediction['output'][0] if isinstance(prediction['output'], list) else prediction['output'],
                "final_prompt": final_prompt.replace(config['keyword'], '').strip()  # Eliminar keyword
            }), 200
            elif prediction['status'] == 'failed':
                raise Exception("Image generation failed")
                
            time.sleep(1)
        
    except Exception as e:
        print(f"Error in generate-persona: {str(e)}")
        return jsonify({"error": str(e)}), 500