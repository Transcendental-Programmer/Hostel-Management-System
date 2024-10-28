import json
import random
import os
import logging
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MultilingualDataGenerator:
    def __init__(self):
        # Define common grievances in multiple languages
        self.grievance_templates = {
            "Hindi": [
                {
                    "source": "toilet me paani nahi aa rha hain",
                    "target": "There is no water coming in the toilet"
                },
                {
                    "source": "light nahi chal rahi hai",
                    "target": "The light is not working"
                },
                {
                    "source": "AC kharab ho gaya hai",
                    "target": "The AC is broken"
                },
                {
                    "source": "fan ki awaaz bahut aa rahi hai",
                    "target": "The fan is making too much noise"
                }
            ],
            "Tamil": [
                {
                    "source": "கழிவறையில் தண்ணீர் வரவில்லை",
                    "target": "There is no water in the toilet"
                },
                {
                    "source": "மின்விளக்கு வேலை செய்யவில்லை",
                    "target": "The light is not working"
                }
            ],
            "Telugu": [
                {
                    "source": "టాయిలెట్‌లో నీళ్లు రావడం లేదు",
                    "target": "There is no water coming in the toilet"
                },
                {
                    "source": "లైట్ పనిచేయడం లేదు",
                    "target": "The light is not working"
                }
            ]
        }

        self.locations = ["toilet", "room", "bathroom", "kitchen", "corridor"]
        self.issues = ["water", "electricity", "AC", "fan", "light"]

    def generate_sample(self) -> Dict:
        """Generate a single translation sample"""
        # Select random language
        source_language = random.choice(list(self.grievance_templates.keys()))
        template = random.choice(self.grievance_templates[source_language])
        
        return {
            "user_message": template["source"],
            "intent": "submit_grievance",
            "entities": {
                "grievance_type": random.choice(self.issues),
                "location": random.choice(self.locations)
            },
            "bot_response": template["target"],
            "source_language": source_language,
            "target_language": "English",
            "translation_pair": {
                "source_sentence": template["source"],
                "target_sentence": template["target"],
                "language_pair": f"{source_language}-English"
            }
        }

    def generate_dataset(self, num_samples: int, output_path: str) -> List[Dict]:
        """Generate and save dataset"""
        logger.info(f"Generating {num_samples} translation samples...")
        
        dataset = []
        for _ in range(num_samples):
            sample = self.generate_sample()
            dataset.append(sample)

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Generated {len(dataset)} samples and saved to {output_path}")
        return dataset

def main():
    generator = MultilingualDataGenerator()
    
    # Generate training data
    train_samples = generator.generate_dataset(
        1000,
        'models/multilingual_translation/train_data/training_data.json'
    )
    
    # Generate test data
    test_samples = generator.generate_dataset(
        200,
        'models/multilingual_translation/test_data/test_data.json'
    )
    
    logger.info(f"Generated {len(train_samples)} training samples and {len(test_samples)} test samples")

if __name__ == "__main__":
    main()

