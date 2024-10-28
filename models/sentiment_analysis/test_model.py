import json
import logging
from datetime import datetime
import os
from model import SentimentAnalysisModel
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sentiment_analysis_testing.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class SentimentAnalysisTester:
    def __init__(self):
        self.model = SentimentAnalysisModel()
        self.results_dir = 'models/sentiment_analysis/test_results'
        self.test_data_path = 'models/sentiment_analysis/test_data/test_data.json'
        os.makedirs(self.results_dir, exist_ok=True)

    def load_test_cases(self):
        """Load test cases from JSON file"""
        try:
            with open(self.test_data_path, 'r') as f:
                test_cases = json.load(f)
            logger.info(f"Successfully loaded {len(test_cases)} test cases")
            return test_cases
        except Exception as e:
            logger.error(f"Error loading test cases: {str(e)}", exc_info=True)
            raise

    def test_sample_grievances(self):
        """Test model with sample grievances"""
        test_cases = self.load_test_cases()
        results = []

        for case in test_cases:
            logger.info(f"\nTesting grievance {case['grievance_id']}")
            logger.info(f"Text: {case['text']}")
            
            result = self.model.process_grievance({
                'grievance_id': case['grievance_id'],
                'text': case['text']
            })
            
            # Add test-specific fields
            result['expected_emotion'] = case['expected_emotion']
            result['matches_expected'] = (
                result.get('emotional_label') == case['expected_emotion']
            )
            
            # Log the result
            logger.info(
                f"Result: Expected={case['expected_emotion']}, "
                f"Got={result.get('emotional_label', 'Unknown')}, "
                f"Confidence={result.get('confidence', 0.0):.2f}"
            )
            
            if result.get('error'):
                logger.warning(f"Error in result: {result['error']}")
            
            results.append(result)
            
            # Add a small delay between requests to avoid rate limiting
            time.sleep(1)

        return results

    def run_full_test(self):
        """Run complete test suite"""
        logger.info("Starting sentiment analysis testing")
        
        try:
            # Test sample grievances
            results = self.test_sample_grievances()
            
            # Calculate accuracy
            correct = sum(1 for r in results if r.get('matches_expected', False))
            accuracy = correct / len(results) if results else 0
            
            # Prepare report
            report = {
                'test_timestamp': datetime.utcnow().isoformat(),
                'accuracy': accuracy,
                'total_tests': len(results),
                'correct_predictions': correct,
                'detailed_results': results
            }
            
            # Save report
            report_path = f'{self.results_dir}/test_report.json'
            with open(report_path, 'w') as f:
                json.dump(report, f, indent=2)
            
            logger.info(f"Testing completed. Results saved to {report_path}")
            logger.info(f"Accuracy: {accuracy:.2%}")
            
            return report
            
        except Exception as e:
            logger.error(f"Error during testing: {str(e)}", exc_info=True)
            raise

def main():
    try:
        tester = SentimentAnalysisTester()
        report = tester.run_full_test()
        
        print("\nTest Results Summary:")
        print(f"Accuracy: {report['accuracy']:.2%}")
        print(f"Total Tests: {report['total_tests']}")
        print(f"Correct Predictions: {report['correct_predictions']}")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
