import logging
from typing import Dict
from datetime import datetime
from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory
import time
import re

# Set seed for consistent language detection
DetectorFactory.seed = 0

logger = logging.getLogger(__name__)

class MultilingualTranslationModel:
    def __init__(self):
        # Supported languages with codes
        self.supported_languages = {
            'en': 'English',
            'hi': 'Hindi',
            'bn': 'Bengali',
            'te': 'Telugu',
            'ta': 'Tamil',
            'mr': 'Marathi',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi'
        }
        
        # Common Hinglish patterns and their English equivalents
        self.hinglish_patterns = {
            r'\b(nahi|nhi)\b': 'not',
            r'\b(hai|he)\b': 'is',
            r'\bpaani\b': 'water',
            r'\bkharab\b': 'broken',
            r'\bgaya\b': 'gone',
            r'\braha\b': 'staying',
            r'\bho\b': 'happening',
            r'\bme\b': 'in',
            r'\bka\b': 'of',
            r'\bki\b': 'of'
        }

    def is_hinglish(self, text: str) -> bool:
        """Check if text is likely Hinglish"""
        # Count Hinglish patterns
        pattern_count = sum(1 for pattern in self.hinglish_patterns if re.search(pattern, text.lower()))
        words = text.split()
        
        # If more than 30% of words match Hinglish patterns, consider it Hinglish
        return pattern_count / len(words) > 0.3 if words else False

    def convert_hinglish_to_english(self, text: str) -> str:
        """Convert Hinglish text to proper English"""
        try:
            # First try direct translation
            translator = GoogleTranslator(source='auto', target='en')
            result = translator.translate(text)
            
            # If translation failed or returned same text, try pattern-based conversion
            if not result or result.lower() == text.lower():
                # Convert to proper English using patterns
                processed_text = text.lower()
                for pattern, replacement in self.hinglish_patterns.items():
                    processed_text = re.sub(pattern, replacement, processed_text)
                return processed_text
                
            return result
            
        except Exception as e:
            logger.error(f"Hinglish conversion failed: {str(e)}")
            return text

    def detect_language(self, text: str, max_retries=3) -> str:
        """Detect the language of input text with retry logic"""
        # Check for Hinglish first
        if self.is_hinglish(text):
            logger.info("Detected Hinglish text")
            return 'hi'

        for attempt in range(max_retries):
            try:
                detected_lang = detect(text)
                logger.info(f"Detected language: {detected_lang}")
                return detected_lang
                
            except Exception as e:
                logger.error(f"Language detection attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(1)

        return 'en'  # Default to English

    def translate(self, text: str, target_lang: str = 'en', max_retries=3) -> Dict:
        """Translate text to target language with retry logic"""
        for attempt in range(max_retries):
            try:
                source_lang = self.detect_language(text)
                logger.info(f"Source language detected: {source_lang}")

                # Handle Hinglish text specially
                if self.is_hinglish(text) and target_lang == 'en':
                    translated_text = self.convert_hinglish_to_english(text)
                else:
                    # If already in target language, return original text
                    if source_lang == target_lang:
                        return {
                            'translated_text': text,
                            'source_language': source_lang,
                            'target_language': target_lang,
                            'confidence': 1.0,
                            'timestamp': datetime.utcnow().isoformat()
                        }

                    # Initialize translator
                    translator = GoogleTranslator(
                        source='auto',
                        target=target_lang
                    )

                    # Perform translation
                    translated_text = translator.translate(text)

                logger.info(f"Translation result: {translated_text}")

                return {
                    'translated_text': translated_text,
                    'source_language': source_lang,
                    'target_language': target_lang,
                    'confidence': 0.9,
                    'timestamp': datetime.utcnow().isoformat()
                }

            except Exception as e:
                logger.error(f"Translation attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(1)
                continue

        return {
            'error': 'Translation failed after maximum retries',
            'timestamp': datetime.utcnow().isoformat()
        }

    def process_message(self, message_data: Dict) -> Dict:
        """Process a chat message and return translation"""
        try:
            if not message_data.get('user_message'):
                return {
                    'error': 'No message provided',
                    'timestamp': datetime.utcnow().isoformat()
                }

            target_lang = message_data.get('target_language', 'en').lower()
            
            # Validate target language
            if target_lang not in self.supported_languages:
                return {
                    'error': f'Unsupported target language: {target_lang}',
                    'timestamp': datetime.utcnow().isoformat()
                }

            result = self.translate(
                message_data['user_message'],
                target_lang
            )

            return {
                'original_message': message_data['user_message'],
                'translated_message': result.get('translated_text', ''),
                'source_language': result.get('source_language', ''),
                'target_language': target_lang,
                'language_name': self.supported_languages.get(target_lang, ''),
                'confidence': result.get('confidence', 0.0),
                'timestamp': result.get('timestamp', datetime.utcnow().isoformat()),
                'error': result.get('error')
            }

        except Exception as e:
            logger.error(f"Message processing error: {str(e)}")
            return {
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
