import sys
from os.path import abspath, dirname

# Add the directory containing the app.py file to the system path
sys.path.insert(0, abspath(dirname(__file__)))

# Import the Flask application object from app.py
from app import app as application


