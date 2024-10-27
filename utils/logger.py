import logging
import sys
from logging.handlers import RotatingFileHandler

def setup_logger(log_level, log_format):
    """Configure application logging"""
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(log_level)

    # Create console handler with formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(log_format))
    logger.addHandler(console_handler)

    # Create file handler with formatting
    file_handler = RotatingFileHandler(
        'app.log',
        maxBytes=10000000,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(logging.Formatter(log_format))
    logger.addHandler(file_handler)

    return logger

def get_logger(name):
    """Get logger instance for a specific module"""
    return logging.getLogger(name)

