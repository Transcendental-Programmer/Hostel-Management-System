import tensorflow as tf
import numpy as np
from datetime import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JobRecommendationModel:
    def __init__(self):
        self.model = None
        self.job_types = ['Electrical', 'Mechanical', 'Plumbing', 'Carpentry', 'Cleaning', 'IT']
        self.urgency_levels = ['Critical', 'High', 'Medium', 'Low']
        
        # Create encodings
        self.job_type_encoding = {job: i for i, job in enumerate(self.job_types)}
        self.urgency_encoding = {level: i for i, level in enumerate(self.urgency_levels)}

    def preprocess_data(self, data):
        """Preprocess input data for model"""
        features = []
        labels = []
        
        for sample in data:
            # Encode job type
            job_type_encoded = [0] * len(self.job_types)
            job_type_idx = self.job_type_encoding[sample['type']]
            job_type_encoded[job_type_idx] = 1
            
            # Encode urgency level
            urgency_encoded = [0] * len(self.urgency_levels)
            urgency_idx = self.urgency_encoding[sample['urgency_level']]
            urgency_encoded[urgency_idx] = 1
            
            # Process each worker
            for worker in sample['workers']:
                if worker['department'] == sample['type']:  # Only process matching department workers
                    # Create feature vector
                    feature = np.array([
                        *job_type_encoded,
                        *urgency_encoded,
                        worker['current_workload'],
                        worker['job_success_rate'],
                        1 if worker['availability_status'] == 'Available' else 0,
                        sample['location']['floor_number']
                    ])
                    features.append(feature)
                    
                    # Create label (1 if worker was assigned)
                    labels.append(1 if worker['availability_status'] == 'Available' and 
                                worker['current_workload'] < 3 and 
                                worker['job_success_rate'] > 0.85 else 0)
        
        if not features:
            raise ValueError("No valid features found in the dataset")
            
        return np.array(features), np.array(labels)

    def build_model(self):
        """Build the neural network model"""
        input_dim = len(self.job_types) + len(self.urgency_levels) + 4  # job_type + urgency + workload + success_rate + availability + floor
        
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(input_dim,)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(16, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model

    def train(self, train_data_path, epochs=10, batch_size=32):
        """Train the model"""
        logger.info(f"Starting model training with {epochs} epochs")
        
        # Load training data
        with open(train_data_path) as f:
            train_data = json.load(f)
        
        # Preprocess data
        X, y = self.preprocess_data(train_data)
        
        # Build and train model
        self.build_model()
        history = self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=1
        )
        
        return history

    def predict(self, input_data):
        """Make predictions for input data"""
        # Preprocess input
        X, _ = self.preprocess_data([input_data])
        
        # Make prediction
        predictions = self.model.predict(X)
        
        # Find best worker
        best_worker = None
        highest_score = -1
        
        for i, worker in enumerate(input_data['workers']):
            if worker['department'] == input_data['type']:
                score = predictions[i][0] * worker['job_success_rate'] * (1 / (worker['current_workload'] + 1))
                if score > highest_score:
                    highest_score = score
                    best_worker = worker
        
        if not best_worker:
            return None
            
        # Generate response
        return {
            "job_id": input_data['job_id'],
            "assigned_worker_id": best_worker['worker_id'],
            "assignment_timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "expected_resolution_time": "1 hour",
            "location": input_data['location']
        }

    def save_model(self, path):
        """Save the trained model"""
        self.model.save(path)

    def load_model(self, path):
        """Load a trained model"""
        self.model = tf.keras.models.load_model(path)