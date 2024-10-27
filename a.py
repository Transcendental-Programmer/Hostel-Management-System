import os
import json

def create_directory_structure():
    # Project root structure
    directories = [
        'config',
        'models/intelligent_routing/train_data',
        'models/intelligent_routing/test_data',
        'models/sentiment_analysis/train_data',
        'models/sentiment_analysis/test_data',
        'models/multilingual_translation/train_data',
        'models/multilingual_translation/test_data',
        'models/job_recommendation/train_data',
        'models/job_recommendation/test_data',
        'api',
        'utils',
        'tests'
    ]

    # Create directories
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        # Create __init__.py in each directory
        init_path = os.path.join(directory, '__init__.py')
        if not os.path.exists(init_path):
            open(init_path, 'a').close()

    # Create all necessary files
    files = {
        'config/config.py': '',
        'models/intelligent_routing/model.py': '',
        'models/sentiment_analysis/model.py': '',
        'models/multilingual_translation/model.py': '',
        'models/job_recommendation/model.py': '',
        'api/routes.py': '',
        'utils/logger.py': '',
        'tests/test_models.py': '',
        'requirements.txt': '',
        'app.py': '',
    }

    for file_path, content in files.items():
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                f.write(content)

    # Create sample training and test data JSON files
    sample_data = {
        "data": [],
        "metadata": {
            "version": "1.0",
            "created_at": "2024-03-20"
        }
    }

    data_files = [
        'models/intelligent_routing/train_data/training_data.json',
        'models/intelligent_routing/test_data/test_data.json',
        'models/sentiment_analysis/train_data/training_data.json',
        'models/sentiment_analysis/test_data/test_data.json',
        'models/multilingual_translation/train_data/training_data.json',
        'models/multilingual_translation/test_data/test_data.json',
        'models/job_recommendation/train_data/training_data.json',
        'models/job_recommendation/test_data/test_data.json'
    ]

    for data_file in data_files:
        if not os.path.exists(data_file):
            with open(data_file, 'w') as f:
                json.dump(sample_data, f, indent=4)

    print("Project structure created successfully!")

def create_gitignore():
    gitignore_content = """
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
ENV/
env/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Local development settings
.env
.env.local

# Model files
*.h5
*.pkl
*.model

# Data files
*.csv
*.xlsx
*.xls
"""
    with open('.gitignore', 'w') as f:
        f.write(gitignore_content.strip())

def create_requirements():
    requirements_content = """
flask==3.0.2
torch==2.2.1
transformers==4.38.2
numpy==1.26.4
pandas==2.2.1
scikit-learn==1.4.1.post1
python-dotenv==1.0.1
requests==2.31.0
pytest==8.1.1
gunicorn==21.2.0
flask-cors==4.0.0
tensorflow==2.15.0
sentence-transformers==2.5.1
"""
    with open('requirements.txt', 'w') as f:
        f.write(requirements_content.strip())

def main():
    create_directory_structure()
    create_gitignore()
    create_requirements()
    print("Project initialization completed!")

if __name__ == "__main__":
    main()