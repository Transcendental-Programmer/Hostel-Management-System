from flask import Flask, jsonify
from routes import api_bp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log', encoding='utf-8'),
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
        logging.info('Home route accessed')  # Add debug logging
        return jsonify({
            'status': 'online',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'Welcome to the Hostel Management API'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    logging.info('Starting Flask application')  
    app.run(debug=True, host='0.0.0.0', port=5000)
