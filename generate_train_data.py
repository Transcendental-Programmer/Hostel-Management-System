import csv
import random
from datetime import datetime, timedelta

def generate_records(num_records=100):
    categories = ['electricity', 'plumbing', 'furniture', 'cleaning', 'internet']
    departments = {
        'electricity': 'electricity',
        'plumbing': 'plumber',
        'furniture': 'furniture',
        'cleaning': 'cleaning',
        'internet': 'it'
    }
    hostel_names = ['bh1', 'bh2', 'bh3', 'bh4', 'gh1', 'gh2', 'gh3', 'gh4']
    staff_id_counter = 67909
    student_id_counter = 600  # Starting from a higher number to avoid conflicts
    base_time = datetime.strptime('2023-10-02T08:00:00Z', '%Y-%m-%dT%H:%M:%SZ')

    with open('data/intelligent_routing/training_data.csv', 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for i in range(num_records):
            grievance_id = f"G12356{i:02d}"
            category = random.choice(categories)
            submission_time = base_time + timedelta(minutes=15 * i)
            submission_timestamp = submission_time.isoformat() + 'Z'
            student_room_no = random.randint(100, 600)
            hostel_name = random.choice(hostel_names)
            floor_number = random.randint(1, 5)

            # Generate staff data
            num_staff = random.randint(3, 5)  # Adding more staff members
            staff_data = []
            for _ in range(num_staff):
                staff_id = f"S{staff_id_counter}"
                staff_id_counter += 1
                department = departments[category]
                current_workload = random.randint(0, 5)
                availability_status = random.choice(['Available', 'Busy'])
                past_resolution_rate = round(random.uniform(0.85, 0.95), 2)
                staff_member = {
                    "staff_id": staff_id,
                    "department": department,
                    "current_workload": current_workload,
                    "availability_status": availability_status,
                    "past_resolution_rate": past_resolution_rate
                }
                staff_data.append(staff_member)
            staff_data_str = str(staff_data).replace("'", '"')

            # Generate floor metrics
            number_of_requests = random.randint(5, 25)
            total_delays = random.randint(0, number_of_requests // 5)
            floor_metrics = {
                "number_of_requests": number_of_requests,
                "total_delays": total_delays
            }
            floor_metrics_str = str(floor_metrics).replace("'", '"')

            # Generate student availability
            student_availability = []
            # Ensure the same time slot for the same student
            student_id = f"STU{student_id_counter}"
            student_id_counter += 1
            start_hour = random.randint(8, 17)
            end_hour = start_hour + 2
            time_slot = f"{start_hour}:00-{end_hour}:00"
            availability_status = random.choice(['Available', 'Unavailable'])
            availability = {
                "student_id": student_id,
                "time_slot": time_slot,
                "availability_status": availability_status
            }
            student_availability.append(availability)
            student_availability_str = str(student_availability).replace("'", '"')

            # Assign staff
            assigned_staff = random.choice(staff_data)["staff_id"]
            assignment_timestamp = (submission_time + timedelta(minutes=1)).isoformat() + 'Z'
            # expected_resolution_time = f"{random.randint(1, 4)} hours"  # Removed

            # Write the row
            row = [
                grievance_id,
                category,
                submission_timestamp,
                student_room_no,
                hostel_name,
                floor_number,
                staff_data_str,
                str(floor_metrics).replace("'", '"'),
                student_availability_str,
                assigned_staff,
                assignment_timestamp,
                ""  # Placeholder for expected resolution time
            ]
            writer.writerow(row)

if __name__ == "__main__":
    generate_records(150)
    print("done")
