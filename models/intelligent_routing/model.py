import tensorflow as tf
import numpy as np
from datetime import datetime
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
        logging.info(f"Initialized IntelligentRoutingModel with {len(self.categories)} categories")

    def preprocess_data(self, data):
        """Enhanced data preprocessing"""
        features = []
        labels = []
        
        for sample in data:
            # Encode category
            category_encoded = [0] * len(self.categories)
            category_idx = self.category_encoding[sample['category']]
            category_encoded[category_idx] = 1
            
            # Process each staff member
            for staff in sample['current_staff_status']:
                if staff['department'] == sample['category']:
                    # Normalize numerical features
                    normalized_workload = staff['current_workload'] / 5.0
                    
                    # Calculate time-based features
                    submission_time = datetime.strptime(sample['submission_timestamp'], "%Y-%m-%dT%H:%M:%SZ")
                    hour_of_day = submission_time.hour / 24.0
                    
                    # Calculate distance (simplified)
                    distance = abs(int(staff.get('current_floor', 0)) - 
                                 int(sample['floor_number'])) / 4.0
                    
                    # Create enhanced feature vector
                    feature = np.array([
                        *category_encoded,
                        sample['floor_number'] / 4.0,  # Normalized floor number
                        normalized_workload,
                        staff['past_resolution_rate'],
                        sample['floor_metrics']['number_of_requests'] / 30.0,
                        sample['floor_metrics']['total_delays'] / 5.0,
                        hour_of_day,
                        1.0 if staff['availability_status'] == 'Available' else 0.0,
                        distance  # Normalized distance
                    ])
                    
                    features.append(feature)
                    
                    # Enhanced label creation
                    is_good_match = (
                        staff['availability_status'] == 'Available' and
                        staff['current_workload'] < 4 and
                        staff['past_resolution_rate'] > 0.85 and
                        distance < 0.5  # Prefer closer staff
                    )
                    labels.append(1 if is_good_match else 0)
        
        if not features:
            raise ValueError("No valid features found in the dataset")
            
        # Convert to numpy arrays
        features = np.array(features)
        labels = np.array(labels)
        
        # Log shapes for debugging
        logging.info(f"Preprocessed data shapes - Features: {features.shape}, Labels: {labels.shape}")
        
        return features, labels

    def build_model(self):
        """Build an improved neural network model"""
        # Calculate input dimension based on features
        input_dim = (
            len(self.categories) +  # One-hot encoded categories
            8  # Additional features: floor_number, workload, resolution_rate, 
               # requests, delays, hour_of_day, availability, distance
        )
        
        logging.info(f"Building model with input dimension: {input_dim}")
        
        model = tf.keras.Sequential([
            # Input layer with regularization
            tf.keras.layers.Dense(128, activation='relu', input_shape=(input_dim,),
                                kernel_regularizer=tf.keras.regularizers.l2(0.01)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),
            
            # Hidden layers with skip connections
            tf.keras.layers.Dense(64, activation='relu',
                                kernel_regularizer=tf.keras.regularizers.l2(0.01)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            
            tf.keras.layers.Dense(32, activation='relu',
                                kernel_regularizer=tf.keras.regularizers.l2(0.01)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.2),
            
            # Output layer
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        # Use a more sophisticated optimizer with learning rate scheduling
        initial_learning_rate = 0.001
        lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
            initial_learning_rate,
            decay_steps=1000,
            decay_rate=0.9,
            staircase=True)
        
        optimizer = tf.keras.optimizers.Adam(learning_rate=lr_schedule)
        
        model.compile(
            optimizer=optimizer,
            loss='binary_crossentropy',
            metrics=['accuracy',
                    tf.keras.metrics.Precision(),
                    tf.keras.metrics.Recall(),
                    tf.keras.metrics.AUC()]
        )
        
        # Print model summary
        model.summary()
        
        self.model = model
        return model

    def train(self, train_data_path, epochs=20, batch_size=32):
        """Enhanced training process"""
        logging.info(f"Starting model training with {epochs} epochs")
        
        # Load and preprocess data
        with open(train_data_path) as f:
            train_data = json.load(f)
        
        X, y = self.preprocess_data(train_data)
        
        # Create validation split
        from sklearn.model_selection import train_test_split
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Handle class imbalance
        from sklearn.utils.class_weight import compute_class_weight
        class_weights = compute_class_weight(
            'balanced',
            classes=np.unique(y_train),
            y=y_train
        )
        class_weight_dict = {i: weight for i, weight in enumerate(class_weights)}
        
        # Build model
        self.build_model()
        
        # Add callbacks
        callbacks = [
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=0.00001
            )
        ]
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_val, y_val),
            class_weight=class_weight_dict,
            callbacks=callbacks,
            verbose=1
        )
        
        return history

    def predict(self, input_data):
        """Make predictions for input data"""
        logging.info(f"Making prediction for grievance {input_data['grievance_id']}")
        # Preprocess input
        X = self.preprocess_data([input_data])
        
        # Make prediction
        prediction = self.model.predict(X)[0][0]
        logging.info(f"Raw prediction: {prediction}")
        
        # Find best matching staff
        best_staff = None
        highest_score = -1
        
        for staff in input_data['current_staff_status']:
            if staff['department'] == input_data['category']:
                score = prediction * staff['past_resolution_rate'] * (1 / (staff['current_workload'] + 1))
                logging.debug(f"Staff {staff['staff_id']} score: {score}")
                if score > highest_score:
                    highest_score = score
                    best_staff = staff
        
        if not best_staff:
            logging.warning("No suitable staff found for the grievance")
            return None
            
        # Generate response
        assignment_time = datetime.utcnow()
        
        response = {
            "grievance_id": input_data['grievance_id'],
            "assigned_staff_id": best_staff['staff_id'],
            "assignment_timestamp": assignment_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "expected_resolution_time": "1 hour",
            "floor_number": input_data['floor_number'],
            "hostel_name": input_data['hostel_name'],
            "student_room_no": input_data['student_room_no']
        }
        logging.info(f"Generated response: {response}")
        return response

    def save_model(self, path):
        """Save the trained model"""
        logging.info(f"Saving model to {path}")
        self.model.save(path)
        logging.info("Model saved successfully")

    def load_model(self, path):
        """Load a trained model"""
        logging.info(f"Loading model from {path}")
        self.model = tf.keras.models.load_model(path)
        logging.info("Model loaded successfully")
