import random
import json
from datetime import datetime, timedelta

class IntelligentRoutingDataGenerator:
    def __init__(self):
        self.categories = ['electricity', 'internet', 'plumber', 'water_cooler', 'sweeper', 'carpenter']
        self.availability_statuses = ['Available', 'Unavailable']
        self.hostel_names = ['bh1', 'bh2', 'bh3', 'ivh', 'gh']
        self.floor_numbers = [0, 1, 2, 3]
        self.time_slots = [
            "08:00-12:00", "12:00-16:00", "16:00-20:00"
        ]

    def generate_staff_member(self, staff_id):
        category = random.choice(self.categories)
        return {
            "staff_id": f"S{staff_id}",
            "department": category,
            "current_workload": random.randint(0, 5),
            "availability_status": random.choice(self.availability_statuses),
            "past_resolution_rate": round(random.uniform(0.85, 0.99), 2)
        }

    def generate_availability_data(self, staff_id, student_id):
        return {
            "staff_availability": [
                {
                    "staff_id": staff_id,
                    "time_slot": random.choice(self.time_slots),
                    "availability_status": random.choice(self.availability_statuses)
                }
            ],
            "student_availability": [
                {
                    "student_id": student_id,
                    "time_slot": random.choice(self.time_slots),
                    "availability_status": random.choice(self.availability_statuses)
                }
            ]
        }

    def generate_sample(self, index):
        grievance_id = f"G{67890 + index}"
        staff_id = f"S{67890 + index}"
        student_id = f"STU{200 + index}"
        
        # Generate base timestamp
        base_time = datetime.utcnow()
        submission_time = base_time - timedelta(minutes=random.randint(0, 60))
        
        # Generate sample data
        sample = {
            "grievance_id": grievance_id,
            "category": random.choice(self.categories),
            "submission_timestamp": submission_time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "student_room_no": str(random.randint(100, 499)),
            "hostel_name": random.choice(self.hostel_names),
            "floor_number": random.choice(self.floor_numbers),
            "current_staff_status": [
                self.generate_staff_member(staff_id) for _ in range(2)
            ],
            "floor_metrics": {
                "number_of_requests": random.randint(0, 30),
                "total_delays": random.randint(0, 5)
            },
            "availability_data": self.generate_availability_data(staff_id, student_id)
        }
        
        return sample

    def generate_dataset(self, num_samples, output_path):
        dataset = []
        for i in range(num_samples):
            sample = self.generate_sample(i)
            dataset.append(sample)
        
        # Save to JSON file
        with open(output_path, 'w') as f:
            json.dump(dataset, f, indent=2)
        
        return dataset

def main():
    generator = IntelligentRoutingDataGenerator()
    
    # Generate training data
    train_samples = generator.generate_dataset(
        1000, 
        'models/intelligent_routing/train_data/training_data.json'
    )
    
    # Generate test data
    test_samples = generator.generate_dataset(
        200, 
        'models/intelligent_routing/test_data/test_data.json'
    )
    
    print(f"Generated {len(train_samples)} training samples and {len(test_samples)} test samples")

if __name__ == "__main__":
    main()
