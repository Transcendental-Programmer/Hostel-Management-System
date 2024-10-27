import json
import random
from datetime import datetime, timedelta
from pathlib import Path

def generate_records(num_records=100):
    # Define paths
    base_path = Path(__file__).parent
    train_data_path = base_path / "train_data" / "training_data.json"
    test_data_path = base_path / "test_data" / "test_data.json"

    categories = ['electricity', 'plumbing', 'furniture', 'cleaning', 'internet']
    departments = {
        'electricity': 'electricity',
        'plumbing': 'plumber',
        'furniture': 'furniture',
        'cleaning': 'cleaning',
        'internet': 'it'
    }
    hostel_names = ['bh1', 'bh2', 'bh3', 'ivh', 'gh']
    staff_id_counter = 67909
    student_id_counter = 600
    base_time = datetime.strptime('2023-10-02T08:00:00Z', '%Y-%m-%dT%H:%M:%SZ')

    # Initialize data structures
    train_data = []
    test_data = []

    for i in range(num_records):
        grievance_id = f"G12356{i:02d}"
        category = random.choice(categories)
        submission_time = base_time + timedelta(minutes=15 * i)
        submission_timestamp = submission_time.isoformat() + 'Z'
        student_room_no = f"{random.randint(1, 6):03d}"
        hostel_name = random.choice(hostel_names)
        floor_number = random.randint(0, 3)  # Changed to match valid floor numbers

        # Generate staff data
        num_staff = random.randint(3, 5)
        staff_data = []
        for _ in range(num_staff):
            staff_id = f"S{staff_id_counter}"
            staff_id_counter += 1
            department = departments[category]
            current_workload = random.randint(0, 5)
            availability_status = random.choice(['Available', 'Unavailable'])
            past_resolution_rate = round(random.uniform(0.85, 0.95), 2)
            staff_member = {
                "staff_id": staff_id,
                "department": department,
                "current_workload": current_workload,
                "availability_status": availability_status,
                "past_resolution_rate": past_resolution_rate
            }
            staff_data.append(staff_member)

        # Generate floor metrics
        floor_metrics = {
            "number_of_requests": random.randint(5, 25),
            "total_delays": random.randint(0, 5)
        }

        # Generate availability data
        student_id = f"STU{student_id_counter}"
        student_id_counter += 1
        start_hour = random.randint(8, 17)
        end_hour = start_hour + 2
        
        availability_data = {
            "staff_availability": [
                {
                    "staff_id": staff_member["staff_id"],
                    "time_slot": f"{start_hour:02d}:00-{end_hour:02d}:00",
                    "availability_status": staff_member["availability_status"]
                } for staff_member in staff_data
            ],
            "student_availability": [
                {
                    "student_id": student_id,
                    "time_slot": f"{start_hour:02d}:00-{end_hour:02d}:00",
                    "availability_status": random.choice(['Available', 'Unavailable'])
                }
            ]
        }

        # Create grievance record
        grievance_record = {
            "grievance_id": grievance_id,
            "category": category,
            "submission_timestamp": submission_timestamp,
            "student_room_no": student_room_no,
            "hostel_name": hostel_name,
            "floor_number": floor_number,
            "current_staff_status": staff_data,
            "floor_metrics": floor_metrics,
            "availability_data": availability_data,
            "assigned_staff_id": random.choice(staff_data)["staff_id"],
            "assignment_timestamp": (submission_time + timedelta(minutes=1)).isoformat() + 'Z'
        }

        # Split data into training and test sets (80-20 split)
        if random.random() < 0.8:
            train_data.append(grievance_record)
        else:
            test_data.append(grievance_record)

    # Ensure directories exist
    train_data_path.parent.mkdir(parents=True, exist_ok=True)
    test_data_path.parent.mkdir(parents=True, exist_ok=True)

    # Write training data
    with open(train_data_path, 'w') as f:
        json.dump({"grievances": train_data}, f, indent=2)

    # Write test data
    with open(test_data_path, 'w') as f:
        json.dump({"grievances": test_data}, f, indent=2)

if __name__ == "__main__":
    generate_records(300)
    print("Generated training and test data successfully!")
