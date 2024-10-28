import json
import logging
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from model import IntelligentRoutingModel
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('testing.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class IntelligentRoutingTester:
    def __init__(self, model_path, test_data_path):
        self.model = IntelligentRoutingModel()
        self.model.load_model(model_path)
        self.test_data_path = test_data_path
        
        # Create results directory
        self.results_dir = 'models/intelligent_routing/test_results'
        os.makedirs(self.results_dir, exist_ok=True)

    def load_test_data(self):
        """Load test data from JSON file"""
        try:
            logger.info(f"Loading test data from {self.test_data_path}")
            with open(self.test_data_path, 'r') as f:
                data = json.load(f)
            logger.info(f"Successfully loaded {len(data)} test samples")
            return data
        except Exception as e:
            logger.error(f"Error loading test data: {str(e)}")
            raise

    def generate_test_cases(self):
        """Generate specific test cases to evaluate model robustness"""
        test_cases = []
        
        # Test case 1: Ideal scenario
        test_cases.append({
            "grievance_id": "G_TEST_1",
            "category": "electricity",
            "submission_timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "floor_number": 1,
            "hostel_name": "bh1",
            "student_room_no": "101",
            "current_staff_status": [
                {
                    "staff_id": "S_TEST_1",
                    "department": "electricity",
                    "current_workload": 1,
                    "availability_status": "Available",
                    "past_resolution_rate": 0.95,
                    "current_floor": 1
                }
            ],
            "floor_metrics": {
                "number_of_requests": 5,
                "total_delays": 1
            }
        })
        
        # Test case 2: High workload scenario
        test_cases.append({
            "grievance_id": "G_TEST_2",
            "category": "plumber",
            "submission_timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "floor_number": 2,
            "hostel_name": "bh2",
            "student_room_no": "201",
            "current_staff_status": [
                {
                    "staff_id": "S_TEST_2",
                    "department": "plumber",
                    "current_workload": 4,
                    "availability_status": "Available",
                    "past_resolution_rate": 0.90,
                    "current_floor": 1
                }
            ],
            "floor_metrics": {
                "number_of_requests": 15,
                "total_delays": 3
            }
        })
        
        # Test case 3: Multiple staff scenario
        test_cases.append({
            "grievance_id": "G_TEST_3",
            "category": "carpenter",
            "submission_timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "floor_number": 3,
            "hostel_name": "bh3",
            "student_room_no": "301",
            "current_staff_status": [
                {
                    "staff_id": "S_TEST_3A",
                    "department": "carpenter",
                    "current_workload": 2,
                    "availability_status": "Available",
                    "past_resolution_rate": 0.88,
                    "current_floor": 3
                },
                {
                    "staff_id": "S_TEST_3B",
                    "department": "carpenter",
                    "current_workload": 1,
                    "availability_status": "Available",
                    "past_resolution_rate": 0.92,
                    "current_floor": 2
                }
            ],
            "floor_metrics": {
                "number_of_requests": 8,
                "total_delays": 2
            }
        })
        
        return test_cases

    def evaluate_model(self):
        """Evaluate model performance on test data"""
        logger.info("Starting model evaluation")
        
        # Load test data
        test_data = self.load_test_data()
        X_test, y_test = self.model.preprocess_data(test_data)
        
        # Get predictions
        logger.info("Making predictions on test data")
        y_pred = self.model.model.predict(X_test)
        y_pred_binary = (y_pred > 0.5).astype(int)
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred_binary),
            'precision': precision_score(y_test, y_pred_binary),
            'recall': recall_score(y_test, y_pred_binary),
            'f1': f1_score(y_test, y_pred_binary)
        }
        
        # Generate confusion matrix
        cm = confusion_matrix(y_test, y_pred_binary)
        
        # Plot confusion matrix
        self.plot_confusion_matrix(cm)
        
        logger.info(f"Evaluation metrics: {metrics}")
        return metrics, cm, y_test, y_pred

    def plot_confusion_matrix(self, cm):
        """Plot and save confusion matrix"""
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(f'{self.results_dir}/confusion_matrix.png')
        plt.close()

    def test_specific_cases(self):
        """Test model on specific test cases"""
        test_cases = self.generate_test_cases()
        results = []
        
        for case in test_cases:
            prediction = self.model.predict(case)
            results.append({
                'case': case['grievance_id'],
                'prediction': prediction,
                'analysis': self.analyze_prediction(case, prediction)
            })
        
        return results

    def analyze_prediction(self, case, prediction):
        """Analyze the prediction for a specific case"""
        if not prediction:
            return "No suitable staff found"
            
        analysis = {
            'assigned_staff': prediction['assigned_staff_id'],
            'response_time': (
                datetime.strptime(prediction['assignment_timestamp'], "%Y-%m-%dT%H:%M:%SZ") -
                datetime.strptime(case['submission_timestamp'], "%Y-%m-%dT%H:%M:%SZ")
            ).total_seconds(),
            'same_floor_assignment': 
                any(staff['current_floor'] == case['floor_number'] 
                    for staff in case['current_staff_status']
                    if staff['staff_id'] == prediction['assigned_staff_id'])
        }
        
        return analysis

    def run_full_test(self):
        """Run complete test suite and generate report"""
        logger.info("Starting full model testing")
        
        # Evaluate model
        metrics, cm, y_test, y_pred = self.evaluate_model()
        
        # Test specific cases
        specific_case_results = self.test_specific_cases()
        
        # Generate test report
        report = {
            'metrics': metrics,
            'specific_case_results': specific_case_results,
            'test_timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            'detailed_analysis': {
                'false_positives': int(cm[0][1]),
                'false_negatives': int(cm[1][0]),
                'average_prediction_confidence': float(np.mean(y_pred))
            }
        }
        
        # Save report
        with open(f'{self.results_dir}/test_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info("Testing completed. Results saved in test_results directory")
        return report

def main():
    try:
        model_path = 'models/intelligent_routing/saved_model/model.keras'
        test_data_path = 'models/intelligent_routing/test_data/test_data.json'
        
        logger.info("Initializing tester")
        tester = IntelligentRoutingTester(model_path, test_data_path)
        
        logger.info("Running full test suite")
        report = tester.run_full_test()
        
        logger.info("\nTest Results Summary:")
        logger.info(f"Accuracy: {report['metrics']['accuracy']:.4f}")
        logger.info(f"Precision: {report['metrics']['precision']:.4f}")
        logger.info(f"Recall: {report['metrics']['recall']:.4f}")
        logger.info(f"F1 Score: {report['metrics']['f1']:.4f}")
        logger.info("\nDetailed Analysis:")
        logger.info(f"False Positives: {report['detailed_analysis']['false_positives']}")
        logger.info(f"False Negatives: {report['detailed_analysis']['false_negatives']}")
        logger.info(f"Avg Prediction Confidence: {report['detailed_analysis']['average_prediction_confidence']:.4f}")
        
    except Exception as e:
        logger.error(f"Error during testing: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
