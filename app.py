from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import register_routes
from utils.logger import setup_logger
from config import config_by_name
import os

def create_app(config_name='dev'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Enable CORS
    CORS(app)
    
    # Setup logging
    setup_logger(app.config['LOG_LEVEL'], app.config['LOG_FORMAT'])
    
    # Register routes
    register_routes(app)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500

    @app.route('/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'version': app.config['API_VERSION']
        })

    return app

if __name__ == '__main__':
    # Get configuration name from environment variable or default to 'dev'
    config_name = os.getenv('FLASK_CONFIG', 'dev')
    app = create_app(config_name)
    
    # Run the application
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)