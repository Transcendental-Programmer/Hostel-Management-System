import requests
import json
import logging
from datetime import datetime
import time
import os
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('endpoint_testing.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class EndpointTester:
    def __init__(self, base_url='http://localhost:5000/api'):
        self.base_url = base_url
        self.results_dir = 'test_results'
        # Create results directory if it doesn't exist
        os.makedirs(self.results_dir, exist_ok=True)

    def test_translation_endpoint(self):
        """Test the translation endpoint"""
        endpoint = f'{self.base_url}/translate'
        test_cases = [
            {
                "user_message": "toilet me paani nahi aa rha hain",
                "target_language": "en"
            },
            {
                "user_message": "AC not working properly",
                "target_language": "hi"
            },
            {
                "user_message": "ਪੱਖਾ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ",
                "target_language": "en"
            }
        ]

        results = []
        for case in test_cases:
            logger.info(f"\nTesting translation endpoint:")
            logger.info(f"Input: {case}")
            
            try:
                response = requests.post(endpoint, json=case)
                result = response.json()
                
                logger.info(f"Status Code: {response.status_code}")
                logger.info(f"Response: {result}")
                
                results.append({
                    'test_case': case,
                    'status_code': response.status_code,
                    'response': result
                })
                
            except Exception as e:
                logger.error(f"Error testing translation: {str(e)}")
                
            time.sleep(1)  # Rate limiting
            
        return results

    def test_sentiment_analysis_endpoint(self):
        """Test the sentiment analysis endpoint"""
        endpoint = f'{self.base_url}/analyze-sentiment'
        test_cases = [
            {
                "grievance_id": "G12347",
                "text": "I am extremely frustrated with the constant power outages in my room."
            },
            {
                "grievance_id": "G12348",
                "text": "Thank you for quickly fixing the water issue."
            },
            {
                "grievance_id": "G12349",
                "text": "The AC has been making strange noises all night."
            }
        ]

        results = []
        for case in test_cases:
            logger.info(f"\nTesting sentiment analysis endpoint:")
            logger.info(f"Input: {case}")
            
            try:
                response = requests.post(endpoint, json=case)
                result = response.json()
                
                logger.info(f"Status Code: {response.status_code}")
                logger.info(f"Response: {result}")
                
                results.append({
                    'test_case': case,
                    'status_code': response.status_code,
                    'response': result
                })
                
            except Exception as e:
                logger.error(f"Error testing sentiment analysis: {str(e)}")
                
            time.sleep(1)
            
        return results

    def test_routing_endpoint(self):
        """Test the grievance routing endpoint"""
        endpoint = f'{self.base_url}/route-grievance'
        test_cases = [
            {
                "grievance_id": "G67890",
                "category": "carpenter",
                "submission_timestamp": "2024-10-28T04:24:24Z",
                "student_room_no": "224",
                "hostel_name": "ivh",
                "floor_number": 1,
                "current_staff_status": [
                    {
                        "staff_id": "S94032",
                        "department": "carpenter",
                        "current_workload": 2,
                        "availability_status": "Unavailable",
                        "past_resolution_rate": 0.97
                    },
                    {
                        "staff_id": "S92059",
                        "department": "carpenter",
                        "current_workload": 4,
                        "availability_status": "Available",
                        "past_resolution_rate": 0.99
                    }
                ],
                "floor_metrics": {
                    "number_of_requests": 30,
                    "total_delays": 3
                },
                "availability_data": {
                    "staff_availability": [
                        {
                            "staff_id": "S94032",
                            "time_slot": "12:00-16:00",
                            "availability_status": "Unavailable"
                        }
                    ],
                    "student_availability": [
                        {
                            "student_id": "STU200",
                            "time_slot": "12:00-16:00",
                            "availability_status": "Available"
                        }
                    ]
                }
            },
            {
                "grievance_id": "G67891",
                "category": "internet",
                "submission_timestamp": "2024-10-28T04:22:24Z",
                "student_room_no": "461",
                "hostel_name": "bh2",
                "floor_number": 0,
                "current_staff_status": [
                    {
                        "staff_id": "S63515",
                        "department": "internet",
                        "current_workload": 3,
                        "availability_status": "Available",
                        "past_resolution_rate": 0.99
                    }
                ],
                "floor_metrics": {
                    "number_of_requests": 15,
                    "total_delays": 0
                }
            }
        ]

        results = []
        for case in test_cases:
            logger.info(f"\nTesting routing endpoint:")
            logger.info(f"Input: {case}")
            
            try:
                response = requests.post(endpoint, json=case)
                result = response.json()
                
                logger.info(f"Status Code: {response.status_code}")
                logger.info(f"Response: {result}")
                
                results.append({
                    'test_case': case,
                    'status_code': response.status_code,
                    'response': result
                })
                
            except Exception as e:
                logger.error(f"Error testing routing: {str(e)}")
                
            time.sleep(1)
            
        return results

    def test_job_recommendation_endpoint(self):
        """Test the job recommendation endpoint"""
        endpoint = f'{self.base_url}/recommend-job'
        test_cases = [
            {
                "job_id": "J60000",
                "type": "IT",
                "description": "IT issue in room 358.",
                "urgency_level": "Low",
                "location": {
                    "hostel_name": "Hostel B",
                    "floor_number": 3,
                    "room_number": "358"
                },
                "workers": [
                    {
                        "worker_id": "W97053",
                        "department": "IT",
                        "current_workload": 3,
                        "availability_status": "Available",
                        "job_success_rate": 0.95,
                        "current_location": {
                            "hostel_name": "Hostel A",
                            "floor_number": 3,
                            "room_number": "468"
                        }
                    },
                    {
                        "worker_id": "W97054",
                        "department": "IT",
                        "current_workload": 1,
                        "availability_status": "Available",
                        "job_success_rate": 0.92,
                        "current_location": {
                            "hostel_name": "Hostel B",
                            "floor_number": 3,
                            "room_number": "360"
                        }
                    }
                ]
            }
        ]

        results = []
        for case in test_cases:
            logger.info(f"\nTesting job recommendation endpoint:")
            logger.info(f"Input: {case}")
            
            try:
                response = requests.post(endpoint, json=case)
                result = response.json()
                
                logger.info(f"Status Code: {response.status_code}")
                logger.info(f"Response: {result}")
                
                results.append({
                    'test_case': case,
                    'status_code': response.status_code,
                    'response': result
                })
                
            except Exception as e:
                logger.error(f"Error testing job recommendation: {str(e)}")
                
            time.sleep(1)
            
        return results

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        endpoint = f'{self.base_url}/health'
        
        try:
            response = requests.get(endpoint)
            result = response.json()
            
            logger.info("\nTesting health endpoint:")
            logger.info(f"Status Code: {response.status_code}")
            logger.info(f"Response: {result}")
            
            return {
                'status_code': response.status_code,
                'response': result
            }
            
        except Exception as e:
            logger.error(f"Error testing health endpoint: {str(e)}")
            return None

    def run_all_tests(self):
        """Run all endpoint tests"""
        try:
            # Test health endpoint first
            health_result = self.test_health_endpoint()
            if not health_result or health_result['status_code'] != 200:
                logger.error("Health check failed. Skipping other tests.")
                return
            
            # Run all tests
            results = {
                'timestamp': datetime.utcnow().isoformat(),
                'health_check': health_result,
                'translation_tests': self.test_translation_endpoint(),
                'sentiment_analysis_tests': self.test_sentiment_analysis_endpoint(),
                'routing_tests': self.test_routing_endpoint(),
                'job_recommendation_tests': self.test_job_recommendation_endpoint()
            }
            
            # Save results
            try:
                results_file = os.path.join(self.results_dir, 'endpoint_test_results.json')
                with open(results_file, 'w', encoding='utf-8') as f:
                    json.dump(results, f, indent=2, ensure_ascii=False)
                logger.info(f"Test results saved to {results_file}")
            except Exception as e:
                logger.error(f"Error saving results: {str(e)}")
                # Continue execution even if saving fails
            
            logger.info("All tests completed successfully")
            return results
            
        except Exception as e:
            logger.error(f"Error running tests: {str(e)}")
            return {
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e),
                'completed_tests': []
            }

def main():
    try:
        tester = EndpointTester()
        results = tester.run_all_tests()
        
        if not results:
            logger.error("No test results available")
            return
            
        # Print summary
        print("\nTest Results Summary:")
        for test_type, test_results in results.items():
            if test_type in ['timestamp', 'error']:
                continue
                
            print(f"\n{test_type.replace('_', ' ').title()}:")
            if isinstance(test_results, list):
                success = sum(1 for r in test_results if r['status_code'] == 200)
                total = len(test_results)
                print(f"Total: {total}")
                print(f"Successful: {success}")
                print(f"Failed: {total - success}")
            else:
                status = test_results.get('status_code') == 200 if test_results else False
                print(f"Status: {'Success' if status else 'Failed'}")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        raise

if __name__ == "__main__":
    main()
