import requests
import logging
from typing import Dict
import os
from datetime import datetime
import time

logger = logging.getLogger(__name__)

class SentimentAnalysisModel:
    def __init__(self):
        # Hugging Face API configuration
        self.api_url = "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis"
        self.headers = {
            "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_TOKEN')}",
            "Content-Type": "application/json"
        }
        
        # Emotion mapping from the model's output to our categories
        self.emotion_mapping = {
            'POS': 'Satisfaction',
            'NEU': 'Indifference',
            'NEG': 'Frustration'
        }

    def predict(self, text: str, max_retries=3, retry_delay=5) -> Dict:
        """
        Get sentiment prediction from Hugging Face API with retry logic
        """
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.api_url,
                    headers=self.headers,
                    json={"inputs": text}
                )
                
                if response.status_code == 503:
                    # Model is loading, wait and retry
                    wait_time = min(retry_delay * (attempt + 1), 20)
                    logger.info(f"Model is loading, waiting {wait_time} seconds before retry...")
                    time.sleep(wait_time)
                    continue
                    
                if response.status_code != 200:
                    logger.error(f"API request failed with status code: {response.status_code}")
                    logger.error(f"Response content: {response.text}")
                    continue
                    
                # Process response
                result = response.json()
                
                if isinstance(result, list) and len(result) > 0:
                    # Get the prediction with highest score
                    prediction = max(result[0], key=lambda x: x['score'])
                    
                    # Map to our emotion categories
                    mapped_emotion = self.emotion_mapping.get(
                        prediction['label'], 
                        'Indifference'
                    )
                    
                    return {
                        'emotional_label': mapped_emotion,
                        'confidence': prediction['score'],
                        'timestamp': datetime.utcnow().isoformat()
                    }
                
            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                continue
        
        # If all retries failed, return default response
        return {
            'emotional_label': 'Indifference',
            'confidence': 0.0,
            'timestamp': datetime.utcnow().isoformat(),
            'error': "Failed after maximum retries"
        }

    def process_grievance(self, grievance_data: Dict) -> Dict:
        """
        Process a grievance and return sentiment analysis
        """
        try:
            if not grievance_data.get('text'):
                return {
                    'grievance_id': grievance_data.get('grievance_id', 'unknown'),
                    'emotional_label': 'Indifference',
                    'confidence': 0.0,
                    'analysis_timestamp': datetime.utcnow().isoformat(),
                    'error': 'No text provided'
                }
            
            # Add some context to help with sentiment analysis
            context_text = f"In a hostel maintenance context: {grievance_data['text']}"
            sentiment_result = self.predict(context_text)
            
            return {
                'grievance_id': grievance_data.get('grievance_id', 'unknown'),
                'text': grievance_data['text'],
                'emotional_label': sentiment_result['emotional_label'],
                'confidence': sentiment_result['confidence'],
                'analysis_timestamp': sentiment_result['timestamp'],
                'error': sentiment_result.get('error')
            }
            
        except Exception as e:
            logger.error(f"Error processing grievance: {str(e)}")
            return {
                'grievance_id': grievance_data.get('grievance_id', 'unknown'),
                'emotional_label': 'Indifference',
                'confidence': 0.0,
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'error': str(e)
            }
