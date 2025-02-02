import json
import random
from pathlib import Path

def load_size_data():
    json_path = Path('static/sizes.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_height_description(base_height, gender):
    # Variación: +17cm/-15cm
    variation = random.uniform(-15, 17)
    height = base_height + variation
    
    if height >= base_height + 12:
        return "very tall"
    elif height >= base_height + 5:
        return "tall"
    elif height <= base_height - 10:
        return "short"
    else:
        return "average height"

def get_build_description(base_weight, gender):
    # Variación: +/-20kg
    variation = random.uniform(-20, 20)
    weight = base_weight + variation
    
    builds = [
        ("slim", -15),
        ("fit", -5),
        ("average build", 5),
        ("muscular", 10),
        ("robust", 15),
        ("heavy built", 20)
    ]
    
    for description, threshold in builds:
        if variation <= threshold:
            return description
    return "robust"

def get_size_characteristics(nationality, gender, size_data):
    """Obtiene características de tamaño basadas en nacionalidad y género"""
    print(f"🔍 Looking for size data: {nationality} ({gender})")
    
    # Intentar obtener datos específicos del país
    country_data = size_data.get(nationality)
    
    # Si no hay datos del país, usar datos del continente
    if not country_data:
        continent = nationality.split('_')[0]
        country_data = size_data.get('continents', {}).get(continent)
        if country_data:
            print(f"✅ Using continent data for {continent}")
    
    if not country_data or gender not in country_data:
        print("❌ No size data found")
        return None
        
    gender_data = country_data[gender]
    
    # Generar descripciones de altura y complexión
    height_desc = get_height_description(gender_data['height'], gender)
    build_desc = get_build_description(gender_data['weight'], gender)
    
    return f"{height_desc} with {build_desc}"