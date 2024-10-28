from model import IntelligentRoutingModel
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('training.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def main():
    try:
        logger.info("Starting model training process")
        
        # Create model instance
        logger.info("Initializing IntelligentRoutingModel")
        model = IntelligentRoutingModel()
        
        # Train model
        train_data_path = 'models/intelligent_routing/train_data/training_data.json'
        logger.info(f"Training model with data from {train_data_path}")
        history = model.train(train_data_path, epochs=10)
        
        # Create directory if it doesn't exist
        os.makedirs('models/intelligent_routing/saved_model', exist_ok=True)
        
        # Save model with correct extension
        model_path = 'models/intelligent_routing/saved_model/model.keras'
        logger.info(f"Saving trained model to {model_path}")
        model.save_model(model_path)
        
        logger.info("Model training completed and saved successfully")
        
    except Exception as e:
        logger.error(f"Error during model training: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
