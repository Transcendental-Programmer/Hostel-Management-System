import json
import logging
from datetime import datetime
import os
from model import MultilingualTranslationModel
import time

# Configure logging with UTF-8 encoding
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('translation_testing.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class TranslationTester:
    def __init__(self):
        self.model = MultilingualTranslationModel()
        self.results_dir = 'models/multilingual_translation/test_results'
        os.makedirs(self.results_dir, exist_ok=True)

    def load_test_data(self):
        """Load test data from JSON file"""
        test_data_path = 'models/multilingual_translation/test_data/test_data.json'
        try:
            with open(test_data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading test data: {str(e)}")
            raise

    def test_translations(self):
        """Test translation with sample messages"""
        test_data = self.load_test_data()
        test_cases = test_data['translation_tests']

        results = []
        for case in test_cases:
            logger.info(f"\nTesting translation:")
            logger.info(f"Original: {case['user_message']}")
            logger.info(f"Target Language: {case['target_language']}")
            
            result = self.model.process_message(case)
            
            # Add test-specific fields
            result['expected_contains'] = case['expected_contains']
            
            # Check if translation contains expected words
            translation = result.get('translated_message', '').lower()
            contains_expected = all(
                word.lower() in translation 
                for word in case['expected_contains']
            ) if not result.get('error') else False
            
            result['translation_quality'] = 'Good' if contains_expected else 'Check needed'
            
            # Log the result
            logger.info(f"Translation: {result.get('translated_message', 'No translation')}")
            logger.info(f"Quality: {result['translation_quality']}")
            logger.info(f"Confidence: {result.get('confidence', 0.0):.2f}")
            
            if result.get('error'):
                logger.warning(f"Error: {result['error']}")
            
            results.append(result)
            time.sleep(1)  # Avoid rate limiting

        return results

    def test_language_detection(self):
        """Test language detection"""
        test_data = self.load_test_data()
        test_cases = test_data['language_detection_tests']

        results = []
        for case in test_cases:
            logger.info(f"\nTesting language detection:")
            logger.info(f"Text: {case['text']}")
            
            detected_lang = self.model.detect_language(case['text'])
            
            result = {
                'text': case['text'],
                'detected_language': detected_lang,
                'expected_language': case['expected_language'],
                'is_correct': detected_lang == case['expected_language']
            }
            
            logger.info(f"Detected: {detected_lang}")
            logger.info(f"Expected: {case['expected_language']}")
            
            results.append(result)
            time.sleep(1)

        return results

    def run_full_test(self):
        """Run complete test suite"""
        logger.info("Starting translation testing")
        
        try:
            # Test translations
            translation_results = self.test_translations()
            
            # Test language detection
            detection_results = self.test_language_detection()
            
            # Prepare report
            report = {
                'test_timestamp': datetime.utcnow().isoformat(),
                'translation_tests': {
                    'total': len(translation_results),
                    'successful': sum(1 for r in translation_results if not r.get('error')),
                    'good_quality': sum(1 for r in translation_results if r.get('translation_quality') == 'Good'),
                    'detailed_results': translation_results
                },
                'detection_tests': {
                    'total': len(detection_results),
                    'successful': sum(1 for r in detection_results if r['is_correct']),
                    'detailed_results': detection_results
                }
            }
            
            # Save report
            report_path = f'{self.results_dir}/test_report.json'
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Testing completed. Results saved to {report_path}")
            
            return report
            
        except Exception as e:
            logger.error(f"Error during testing: {str(e)}", exc_info=True)
            raise

def main():
    try:
        tester = TranslationTester()
        report = tester.run_full_test()
        
        print("\nTest Results Summary:")
        print("Translation Tests:")
        print(f"Total: {report['translation_tests']['total']}")
        print(f"Successful: {report['translation_tests']['successful']}")
        print(f"Good Quality: {report['translation_tests']['good_quality']}")
        print("\nLanguage Detection Tests:")
        print(f"Total: {report['detection_tests']['total']}")
        print(f"Successful: {report['detection_tests']['successful']}")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
