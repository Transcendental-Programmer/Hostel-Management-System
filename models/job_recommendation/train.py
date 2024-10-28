from model import JobRecommendationModel
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('job_recommendation_training.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Starting job recommendation model training")
        
        # Create model instance
        model = JobRecommendationModel()
        
        # Train model
        train_data_path = 'models/job_recommendation/train_data/training_data.json'
        history = model.train(train_data_path, epochs=10)
        
        # Create directory if it doesn't exist
        os.makedirs('models/job_recommendation/saved_model', exist_ok=True)
        
        # Save model
        model_path = 'models/job_recommendation/saved_model/model.keras'
        model.save_model(model_path)
        
        logger.info("Model training completed and saved successfully")
        
    except Exception as e:
        logger.error(f"Error during model training: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()