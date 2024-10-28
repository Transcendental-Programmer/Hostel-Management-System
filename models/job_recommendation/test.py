import json
import logging
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from model import JobRecommendationModel
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('job_recommendation_testing.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class JobRecommendationTester:
    def __init__(self, model_path, test_data_path):
        self.model = JobRecommendationModel()
        self.model.load_model(model_path)
        self.test_data_path = test_data_path
        
        # Create results directory
        self.results_dir = 'models/job_recommendation/test_results'
        os.makedirs(self.results_dir, exist_ok=True)

    def load_test_data(self):
        """Load test data from JSON file"""
        with open(self.test_data_path, 'r') as f:
            return json.load(f)

    def evaluate_model(self):
        """Evaluate model performance on test data"""
        test_data = self.load_test_data()
        X_test, y_test = self.model.preprocess_data(test_data)
        
        # Get predictions
        y_pred = self.model.model.predict(X_test)
        y_pred_binary = (y_pred > 0.5).astype(int)
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred_binary),
            'precision': precision_score(y_test, y_pred_binary),
            'recall': recall_score(y_test, y_pred_binary),
            'f1': f1_score(y_test, y_pred_binary)
        }
        
        cm = confusion_matrix(y_test, y_pred_binary)
        
        return metrics, cm, y_test, y_pred

    def run_full_test(self):
        """Run complete test suite"""
        logger.info("Starting full model testing")
        
        metrics, cm, y_test, y_pred = self.evaluate_model()
        
        # Save results
        report = {
            'metrics': metrics,
            'test_timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        
        with open(f'{self.results_dir}/test_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info("Testing completed. Results saved in test_results directory")
        return report

def main():
    try:
        model_path = 'models/job_recommendation/saved_model/model.keras'
        test_data_path = 'models/job_recommendation/test_data/test_data.json'
        
        tester = JobRecommendationTester(model_path, test_data_path)
        report = tester.run_full_test()
        
        logger.info("\nTest Results Summary:")
        logger.info(f"Accuracy: {report['metrics']['accuracy']:.4f}")
        logger.info(f"Precision: {report['metrics']['precision']:.4f}")
        logger.info(f"Recall: {report['metrics']['recall']:.4f}")
        logger.info(f"F1 Score: {report['metrics']['f1']:.4f}")
        
    except Exception as e:
        logger.error(f"Error during testing: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()