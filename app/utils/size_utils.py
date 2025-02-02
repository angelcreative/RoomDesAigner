import json
import random
from pathlib import Path

def load_size_data():
    """Carga los datos de tamaños desde el archivo JSON"""
    size_file = Path("static/sizes.json")
    with open(size_file, "r", encoding="utf-8") as f:
        return json.load(f)

def get_continent_for_country(country):
    """Mapeo de países a continentes"""
    continent_map = {
         # Europa
        "spain": "europe", "france": "europe", "netherlands": "europe", "montenegro": "europe",
        "estonia": "europe", "denmark": "europe", "bosnia": "europe", "iceland": "europe",
        "czechia": "europe", "slovenia": "europe", "slovakia": "europe", "croatia": "europe",
        "serbia": "europe", "sweden": "europe", "norway": "europe", "lithuania": "europe",
        "poland": "europe", "ukraine": "europe", "finland": "europe", "latvia": "europe",
        "germany": "europe", "belgium": "europe", "greece": "europe", "switzerland": "europe",
        "ireland": "europe", "austria": "europe", "belarus": "europe", "andorra": "europe",
        "luxembourg": "europe", "united_kingdom": "europe", "romania": "europe", "hungary": "europe",
        "russia": "europe", "bulgaria": "europe", "albania": "europe", "portugal": "europe",
        "italy": "europe",

        # América del Norte
        "usa": "north_america", "canada": "north_america", "mexico": "north_america",
        
        # América del Sur
        "brazil": "south_america", "argentina": "south_america", "colombia": "south_america",
        "venezuela": "south_america", "chile": "south_america", "ecuador": "south_america",
        "bolivia": "south_america", "paraguay": "south_america", "peru": "south_america",
        "uruguay": "south_america",

        # Asia
        "china": "east_asia", "japan": "east_asia", "south_korea": "east_asia", 
        "north_korea": "east_asia", "taiwan": "east_asia", "hong_kong": "east_asia",
        "vietnam": "southeast_asia", "thailand": "southeast_asia", "malaysia": "southeast_asia",
        "indonesia": "southeast_asia", "philippines": "southeast_asia", "singapore": "southeast_asia",
        "cambodia": "southeast_asia", "myanmar": "southeast_asia", "laos": "southeast_asia",
        "india": "south_asia", "pakistan": "south_asia", "bangladesh": "south_asia",
        "nepal": "south_asia", "sri_lanka": "south_asia"
    }
    
    # Si el país no está en el mapeo, intentar inferir el continente
    if country not in continent_map:
        if any(region in country for region in ["south_america", "latin"]):
            return "south_america"
        elif any(region in country for region in ["north_america"]):
            return "north_america"
        elif any(region in country for region in ["asia", "east", "stan"]):
            return "east_asia"
        elif any(region in country for region in ["africa"]):
            return "africa"
    
    return continent_map.get(country, "europe")

def get_size_characteristics(nationality, gender, size_data):
    """Obtiene características de tamaño basadas en nacionalidad y género"""
    try:
        # Obtener datos base
        country_data = size_data.get("countries", {}).get(nationality)
        if not country_data:
            continent = get_continent_for_country(nationality)
            country_data = size_data.get("continents", {}).get(continent, {})
        
        if not country_data or gender not in country_data:
            return None

        base_data = country_data[gender]
        height = base_data["height"]
        weight = calculate_weight_variation(base_data)

        # Convertir medidas a descripciones
        height_desc = get_height_description(height)
        build_desc = get_build_description(weight, base_data["weight"])

        return f"{height_desc} with {build_desc}"

    except Exception as e:
        print(f"Error getting size characteristics: {str(e)}")
        return None

def get_height_description(height):
    """Convierte altura en descripción"""
    if height >= 1.85:
        return "very tall"
    elif height >= 1.75:
        return "tall"
    elif height <= 1.60:
        return "short"
    else:
        return "average height"

def get_build_description(weight, base_weight):
    """Convierte peso en descripción de complexión"""
    diff = weight - base_weight
    
    if diff <= -15:
        return "slim build"
    elif diff <= -5:
        return "fit build"
    elif diff <= 5:
        return "average build"
    elif diff <= 15:
        return "muscular build"
    else:
        return "robust build"

def calculate_weight_variation(base_data):
    """Calcula una variación de peso realista"""
    base_weight = base_data["weight"]
    variation = random.uniform(-20, 20)
    return round(base_weight + variation, 1)