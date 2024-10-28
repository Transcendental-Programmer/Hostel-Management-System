import random
import json
from datetime import datetime, timedelta
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JobRecommendationDataGenerator:
    def __init__(self):
        self.job_types = ['Electrical', 'Mechanical', 'Plumbing', 'Carpentry', 'Cleaning', 'IT']
        self.urgency_levels = ['Critical', 'High', 'Medium', 'Low']
        self.hostel_names = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D']
        self.availability_statuses = ['Available', 'Busy', 'On Leave']

    def generate_location(self):
        return {
            "hostel_name": random.choice(self.hostel_names),
            "floor_number": random.randint(0, 4),
            "room_number": f"{random.randint(1, 4)}{random.randint(0, 9)}{random.randint(0, 9)}"
        }

    def generate_worker(self, department=None):
        if department is None:
            department = random.choice(self.job_types)
            
        return {
            "worker_id": f"W{random.randint(10000, 99999)}",
            "department": department,
            "current_workload": random.randint(0, 5),
            "availability_status": random.choice(self.availability_statuses),
            "job_success_rate": round(random.uniform(0.80, 0.99), 2),
            "current_location": self.generate_location()
        }

    def generate_sample(self, index):
        job_type = random.choice(self.job_types)
        location = self.generate_location()
        
        # Generate workers list with at least one matching department
        workers = [self.generate_worker(job_type)]  # Ensure one matching worker
        workers.extend([self.generate_worker() for _ in range(random.randint(2, 4))])
        
        sample = {
            "job_id": f"J{60000 + index}",
            "type": job_type,
            "description": f"{job_type} issue in room {location['room_number']}.",
            "urgency_level": random.choice(self.urgency_levels),
            "submission_timestamp": (datetime.utcnow() - timedelta(minutes=random.randint(0, 60))).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "location": location,
            "workers": workers
        }
        
        return sample

    def generate_dataset(self, num_samples, output_path):
        logger.info(f"Generating {num_samples} samples...")
        dataset = []
        for i in range(num_samples):
            sample = self.generate_sample(i)
            dataset.append(sample)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save to JSON file
        with open(output_path, 'w') as f:
            json.dump(dataset, f, indent=2)
        
        logger.info(f"Generated {len(dataset)} samples and saved to {output_path}")
        return dataset

def main():
    generator = JobRecommendationDataGenerator()
    
    # Generate training data
    train_samples = generator.generate_dataset(
        20000, 
        'models/job_recommendation/train_data/training_data.json'
    )
    
    # Generate test data
    test_samples = generator.generate_dataset(
        4000, 
        'models/job_recommendation/test_data/test_data.json'
    )
    
    logger.info(f"Generated {len(train_samples)} training samples and {len(test_samples)} test samples")

if __name__ == "__main__":
    main()