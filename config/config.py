import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # API Configuration
    API_VERSION = "v1"
    API_TITLE = "Hostel Grievance System API"
    DEBUG = os.getenv("DEBUG", True)
    
    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")
    
    # Model Paths
    INTELLIGENT_ROUTING_MODEL_PATH = "models/intelligent_routing/model/"
    SENTIMENT_ANALYSIS_MODEL_PATH = "models/sentiment_analysis/model/"
    MULTILINGUAL_TRANSLATION_MODEL_PATH = "models/multilingual_translation/model/"
    JOB_RECOMMENDATION_MODEL_PATH = "models/job_recommendation/model/"
    
    # Data Paths
    TRAIN_DATA_PATH = "train_data/training_data.json"
    TEST_DATA_PATH = "test_data/test_data.json"
    
    # API Endpoints
    INTELLIGENT_ROUTING_ENDPOINT = "/api/v1/intelligent-routing"
    SENTIMENT_ANALYSIS_ENDPOINT = "/api/v1/sentiment-analysis"
    MULTILINGUAL_TRANSLATION_ENDPOINT = "/api/v1/multilingual-translation"
    JOB_RECOMMENDATION_ENDPOINT = "/api/v1/job-recommendation"
    
    # Model Parameters
    BATCH_SIZE = 32
    LEARNING_RATE = 0.001
    EPOCHS = 10
    
    # Logging Configuration
    LOG_LEVEL = "INFO"
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_FILE = "app.log"

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    DEBUG = True
    TESTING = True

# Configuration dictionary
config_by_name = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig,
    'test': TestingConfig
}
