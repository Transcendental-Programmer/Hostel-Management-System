from pathlib import Path

class Config:
    # Base paths
    BASE_DIR = Path(__file__).parent.parent
    MODEL_DIR = BASE_DIR / "models" / "intelligent_routing"
    
    # Data paths
    TRAIN_DATA_PATH = MODEL_DIR / "train_data" / "training_data.json"
    TEST_DATA_PATH = MODEL_DIR / "test_data" / "test_data.json"
    
    # Model parameters
    LEARNING_RATE = 0.001
    BATCH_SIZE = 32
    EPOCHS = 100
    
    # Valid categories and values
    VALID_CATEGORIES = [
        "electricity", "internet", "plumber", 
        "water_cooler", "sweeper", "carpenter"
    ]
    
    VALID_FLOOR_NUMBERS = [0, 1, 2, 3]
    
    VALID_HOSTELS = ["bh1", "bh2", "bh3", "ivh", "gh"]
    
    VALID_AVAILABILITY_STATUS = ["Available", "Unavailable"]

