import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from typing import Dict, List, Tuple

class GrievancePreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
        
    def preprocess_grievance(self, grievance_data: Dict) -> np.ndarray:
        """
        Preprocess a single grievance for model input
        """
        # Extract features
        numerical_features = [
            grievance_data['floor_number'],
            len(grievance_data.get('current_staff_status', [])),
            grievance_data.get('floor_metrics', {}).get('number_of_requests', 0),
            grievance_data.get('floor_metrics', {}).get('total_delays', 0)
        ]
        
        categorical_features = [
            grievance_data['category'],
            grievance_data['hostel_name']
        ]
        
        # Convert to numpy arrays
        numerical_features = np.array(numerical_features).reshape(1, -1)
        categorical_features = np.array(categorical_features).reshape(1, -1)
        
        # Scale numerical features
        scaled_numerical = self.scaler.transform(numerical_features)
        
        # Encode categorical features
        encoded_categorical = self.encoder.transform(categorical_features)
        
        # Combine features
        combined_features = np.concatenate([scaled_numerical, encoded_categorical], axis=1)
        
        return combined_features
        
    def preprocess_staff(self, staff_data: List[Dict]) -> np.ndarray:
        """
        Preprocess staff data for model input
        """
        features = []
        for staff in staff_data:
            staff_features = [
                staff['current_workload'],
                staff['past_resolution_rate'],
                1 if staff['availability_status'] == 'Available' else 0
            ]
            features.append(staff_features)
            
        features = np.array(features)
        return self.scaler.transform(features)
        
    def fit(self, grievance_data: List[Dict], staff_data: List[Dict]):
        """
        Fit the preprocessor on training data
        """
        # Prepare numerical features for grievances
        numerical_features = []
        categorical_features = []
        
        for grievance in grievance_data:
            numerical_features.append([
                grievance['floor_number'],
                len(grievance.get('current_staff_status', [])),
                grievance.get('floor_metrics', {}).get('number_of_requests', 0),
                grievance.get('floor_metrics', {}).get('total_delays', 0)
            ])
            
            categorical_features.append([
                grievance['category'],
                grievance['hostel_name']
            ])
            
        numerical_features = np.array(