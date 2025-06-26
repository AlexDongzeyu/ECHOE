import sys
import os

# Add the NPO-SCA directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'NPO-SCA'))

# Import the Flask app from the NPO-SCA directory
from app import app

# This is what Azure will use
application = app

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8000) 