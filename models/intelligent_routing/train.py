from model import IntelligentRoutingModel
import os

def main():
    # Create model instance
    model = IntelligentRoutingModel()
    
    # Train model
    train_data_path = 'train_data/training_data.json'
    history = model.train(train_data_path, epochs=10)
    
    # Save model
    model.save_model('model/intelligent_routing_model')
    
    print("Model training completed and saved successfully")

if __name__ == "__main__":
    main()