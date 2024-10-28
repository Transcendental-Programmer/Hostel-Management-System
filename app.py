import os
from flask import Flask, jsonify
from routes import api_bp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Home route
    @app.route('/')
    def home():
        return jsonify({
            'status': 'online',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'Welcome to the Hostel Management API'
        })
    
    return app

# This is for both local and production
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
