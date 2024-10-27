import torch
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
import numpy as np
from typing import List, Dict, Tuple
import json
from pathlib import Path

from .model import IntelligentRoutingModel, RoutingEnvironment
from .preprocessor import GrievancePreprocessor
from ...config.config import Config

class IntelligentRoutingTrainer:
    def __init__(self):
        self.config = Config()
        self.preprocessor = GrievancePreprocessor()
        self.environment = RoutingEnvironment()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Initialize model
        input_size = self._calculate_input_size()
        self.model = IntelligentRoutingModel(
            input_size=input_size,
            hidden_size=128,
            num_staff=50  # Adjust based on your staff size
        ).to(self.device)
        
        self.optimizer = optim.Adam(
            self.model.parameters(), 
            lr=self.config.LEARNING_RATE
        )
        
    def _calculate_input_size(self) -> int:
        # Calculate total input size based on features
        numerical_features = 4  # floor_number, staff_count, request_count, delay_count
        categorical_features = len(self.config.VALID_CATEGORIES) + len(self.config.VALID_HOSTELS)
        return numerical_features + categorical_features
        
    def load_data(self) -> Tuple[List[Dict], List[Dict]]:
        """Load training and test data"""
        with open(self.config.TRAIN_DATA_PATH) as f:
            train_data = json.load(f)
            
        with open(self.config.TEST_DATA_PATH) as f:
            test_data = json.load(f)
            
        return train_data, test_data
        
    def train(self, num_episodes: int = 1000):
        """Train the model using reinforcement learning"""
        train_data, _ = self.load_data()
        
        for episode in range(num_episodes):
            state = self.environment.reset()
            episode_reward = 0
            
            for grievance in train_data:
                # Preprocess grievance
                grievance_features = self.preprocessor.preprocess_grievance(grievance)
                grievance_tensor = torch.FloatTensor(grievance_features).to(self.device)
                
                # Get model prediction
                with torch.no_grad():
                    action_probs = self.model(grievance_tensor)
                
                # Select action (staff member)
                action = torch.argmax(action_probs).item()
                
                # Take step in environment
                next_state, reward, done = self.environment.step(action, grievance)
                episode_reward += reward
                
                if done:
                    break
                    
                state = next_state
                
            # Update model
            self.optimizer.zero_grad()
            loss = -episode_reward  # Simple policy gradient
            loss.backward()
            self.optimizer.step()
            
            if episode % 100 == 0:
                print(f"Episode {episode}, Reward: {episode_reward}")
                
    def evaluate(self, test_data: List[Dict]) -> Dict:
        """Evaluate the model on test data"""
        self.model.eval()
        total_reward = 0
        correct_assignments = 0
        
        with torch.no_grad():
            for grievance in test_data:
                grievance_features = self.preprocessor.preprocess_grievance(grievance)
                grievance_tensor = torch.FloatTensor(grievance_features).to(self.device)
                
                action_probs = self.model(grievance_tensor)
                action = torch.argmax(action_probs).item()
                
                # Calculate reward for this assignment
                _, reward, _ = self.environment.step(action, grievance)
                total_reward += reward
                
                # Check if assignment matches ground truth (if available)
                if 'assigned_staff_id' in grievance:
                    correct_assignments += (action == grievance['assigned_staff_id'])
                    
        return {
            'total_reward': total_reward,
            'average_reward': total_reward / len(test_data),
            'accuracy': correct_assignments / len(test_data) if 'assigned_staff_id' in test_data[0] else None
        }
        
    def save_model(self, path: str):
        """Save the trained model"""
        torch.save({
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict()
        }, path)
        
    def load_model(self, path: str):
        """Load a trained model"""
        checkpoint = torch.load(path)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
