import json
import random
from pathlib import Path

def load_size_data():
    """Carga los datos de tamaños desde el archivo JSON"""
    size_file = Path("static/sizes.json")
    with open(size_file, "r", encoding="utf-8") as f:
        return json.load(f)

def get_continent_for_country(country):
    """Mapeo completo de países a continentes basado en worlddata.info"""
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
    
    # Si el país no está en el mapeo, intentar inferir el continente del nombre
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

def calculate_body_size(nationality, gender, prompt=""):
    """Calcula el tamaño corporal basado en nacionalidad y género"""
    try:
        size_data = load_size_data()
        
        # Verificar palabras clave de salud
        is_healthy = any(trigger in prompt.lower() for trigger in size_data["health_triggers"])
        
        # Obtener datos base
        country_data = size_data["countries"].get(nationality)
        if not country_data:
            continent = get_continent_for_country(nationality)
            country_data = size_data["continents"][continent]
        
        base_data = country_data[gender]
        
        # Calcular peso con variación
        if is_healthy:
            # Para personas saludables, usar IMC entre 20-25
            height = base_data["height"]
            weight = round(random.uniform(20 * (height ** 2), 25 * (height ** 2)), 1)
        else:
            weight = calculate_weight_variation(base_data)
        
        return {
            "height": base_data["height"],
            "weight": weight
        }
    except Exception as e:
        print(f"Error calculating body size: {str(e)}")
        return None

def calculate_weight_variation(base_data):
    """Calcula una variación de peso realista"""
    base_weight = base_data["weight"]
    variations = base_data.get("weight_variation", {
        "max_plus": 35,
        "max_minus": 12,
        "plus_weight": 5,
        "minus_weight": 15
    })
    
    weight_options = []
    # Peso base (mayor probabilidad)
    weight_options.extend([base_weight] * 80)
    
    # Pesos mayores (progresivo)
    for i in range(1, variations["max_plus"], 5):
        weight_options.extend([base_weight + i] * variations["plus_weight"])
    
    # Pesos menores (progresivo)
    for i in range(1, variations["max_minus"], 3):
        weight_options.extend([base_weight - i] * variations["minus_weight"])
    
    return round(random.choice(weight_options), 1)