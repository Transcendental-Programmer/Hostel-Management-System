from flask import Flask
from api.routes import routing_bp
from config.config import Config

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(routing_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

