import tensorflow as tf
import numpy as np
from datetime import datetime
import json

class IntelligentRoutingModel:
    def __init__(self):
        self.model = None
        self.feature_columns = [
            'category_encoded',
            'floor_number',
            'current_workload',
            'past_resolution_rate',
            'number_of_requests',
            'total_delays'
        ]
        
        # Category encoding
        self.categories = ['electricity', 'internet', 'plumber', 'water_cooler', 'sweeper', 'carpenter']
        self.category_encoding = {cat: i for i, cat in enumerate(self.categories)}

    def preprocess_data(self, data):
        """Preprocess input data for model"""
        features = []
        for sample in data:
            # Encode category
            category_encoded = [0] * len(self.categories)
            category_idx = self.category_encoding[sample['category']]
            category_encoded[category_idx] = 1
            
            # Get staff with matching department
            matching_staff = None
            for staff in sample['current_staff_status']:
                if staff['department'] == sample['category']:
                    matching_staff = staff
                    break
            
            if not matching_staff:
                continue
                
            feature = np.array([
                *category_encoded,
                sample['floor_number'],
                matching_staff['current_workload'],
                matching_staff['past_resolution_rate'],
                sample['floor_metrics']['number_of_requests'],
                sample['floor_metrics']['total_delays']
            ])
            features.append(feature)
            
        return np.array(features)

    def build_model(self):
        """Build the neural network model"""
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(len(self.categories) + 5,)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
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
        # Load training data
        with open(train_data_path) as f:
            train_data = json.load(f)
        
        # Preprocess data
        X = self.preprocess_data(train_data)
        
        # Simple target: 1 if staff should be assigned, 0 otherwise
        y = np.array([1 if sample['current_staff_status'][0]['availability_status'] == 'Available' 
                     else 0 for sample in train_data])
        
        # Build and train model
        self.build_model()
        history = self.model.fit(
            X, y,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2
        )
        
        return history

    def predict(self, input_data):
        """Make predictions for input data"""
        # Preprocess input
        X = self.preprocess_data([input_data])
        
        # Make prediction
        prediction = self.model.predict(X)[0][0]
        
        # Find best matching staff
        best_staff = None
        highest_score = -1
        
        for staff in input_data['current_staff_status']:
            if staff['department'] == input_data['category']:
                score = prediction * staff['past_resolution_rate'] * (1 / (staff['current_workload'] + 1))
                if score > highest_score:
                    highest_score = score
                    best_staff = staff
        
        if not best_staff:
            return None
            
        # Generate response
        assignment_time = datetime.utcnow()
        
        return {
            "grievance_id": input_data['grievance_id'],
            "assigned_staff_id": best_staff['staff_id'],
            "assignment_timestamp": assignment_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "expected_resolution_time": "1 hour",
            "floor_number": input_data['floor_number'],
            "hostel_name": input_data['hostel_name'],
            "student_room_no": input_data['student_room_no']
        }

    def save_model(self, path):
        """Save the trained model"""
        self.model.save(path)

    def load_model(self, path):
        """Load a trained model"""
        self.model = tf.keras.models.load_model(path)