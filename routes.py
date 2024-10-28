from flask import Blueprint, request, jsonify
from models.multilingual_translation.model import MultilingualTranslationModel
from models.sentiment_analysis.model import SentimentAnalysisModel
from models.intelligent_routing.model import IntelligentRoutingModel
from models.job_recommendation.model import JobRecommendationModel
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

# Initialize models with proper paths
translation_model = MultilingualTranslationModel()
sentiment_model = SentimentAnalysisModel()
routing_model = IntelligentRoutingModel()
job_model = JobRecommendationModel()

# Load pre-trained models
try:
    routing_model.load_model('models/intelligent_routing/saved_model/model.keras')
    job_model.load_model('models/job_recommendation/saved_model/model.keras')
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")

@api_bp.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        
        if not data or 'user_message' not in data:
            return jsonify({
                'error': 'Missing required fields',
                'required': ['user_message', 'target_language']
            }), 400

        result = translation_model.process_message(data)
        
        if result.get('error'):
            return jsonify({
                'error': result['error']
            }), 400
            
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return jsonify({
            'error': 'Internal server error'
        }), 500

@api_bp.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        
        if not data or 'grievance_id' not in data or 'text' not in data:
            return jsonify({
                'error': 'Missing required fields',
                'required': ['grievance_id', 'text']
            }), 400

        result = sentiment_model.process_grievance(data)
        
        if result.get('error'):
            return jsonify({
                'error': result['error']
            }), 400
            
        return jsonify({
            'grievance_id': data['grievance_id'],
            'emotional_label': result['emotional_label'],
            'confidence': result['confidence'],
            'timestamp': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@api_bp.route('/route-grievance', methods=['POST'])
def route_grievance():
    try:
        data = request.get_json()
        
        required_fields = [
            'grievance_id', 'category', 'student_room_no', 
            'hostel_name', 'floor_number', 'current_staff_status'
        ]
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Missing required fields',
                'required': required_fields
            }), 400

        # Format timestamp to match expected format
        if 'submission_timestamp' in data:
            try:
                # Convert to proper format
                timestamp = datetime.fromisoformat(data['submission_timestamp'].replace('Z', '+00:00'))
                data['submission_timestamp'] = timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
            except Exception as e:
                logger.warning(f"Error formatting timestamp: {str(e)}")
                data['submission_timestamp'] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        result = routing_model.predict(data)
        
        if not result:
            return jsonify({
                'error': 'No suitable staff found'
            }), 404
            
        return jsonify({
            'grievance_id': data['grievance_id'],
            'assigned_staff_id': result['assigned_staff_id'],
            'assignment_timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            'confidence_score': result.get('confidence_score', 0.0),
            'estimated_resolution_time': result.get('estimated_resolution_time')
        }), 200

    except Exception as e:
        logger.error(f"Routing error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@api_bp.route('/recommend-job', methods=['POST'])
def recommend_job():
    try:
        data = request.get_json()
        
        required_fields = [
            'job_id', 'type', 'description', 'urgency_level',
            'location', 'workers'
        ]
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Missing required fields',
                'required': required_fields
            }), 400

        # Filter available workers of matching department
        available_workers = [
            w for w in data['workers'] 
            if w['department'].lower() == data['type'].lower() 
            and w['availability_status'] == 'Available'
        ]

        if not available_workers:
            return jsonify({
                'error': 'No suitable workers found',
                'details': 'No available workers matching the job type'
            }), 404

        # Sort workers by workload and success rate
        sorted_workers = sorted(
            available_workers,
            key=lambda w: (-w['job_success_rate'], w['current_workload'])
        )

        # Get best worker and alternatives
        best_worker = sorted_workers[0]
        alternative_workers = sorted_workers[1:3] if len(sorted_workers) > 1 else []
            
        return jsonify({
            'job_id': data['job_id'],
            'recommended_worker_id': best_worker['worker_id'],
            'recommendation_timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            'predicted_completion_time': calculate_completion_time(best_worker, data['urgency_level']),
            'confidence_score': best_worker['job_success_rate'],
            'alternative_workers': [
                {
                    'worker_id': w['worker_id'],
                    'confidence_score': w['job_success_rate'],
                    'current_workload': w['current_workload']
                } for w in alternative_workers
            ]
        }), 200

    except Exception as e:
        logger.error(f"Job recommendation error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

def calculate_completion_time(worker, urgency):
    """Calculate estimated completion time based on worker load and urgency"""
    base_hours = {
        'High': 2,
        'Medium': 4,
        'Low': 8
    }
    
    # Adjust based on workload
    workload_factor = 1 + (worker['current_workload'] * 0.2)  # 20% increase per existing job
    estimated_hours = base_hours.get(urgency, 4) * workload_factor
    
    completion_time = datetime.utcnow()
    completion_time = completion_time.replace(
        hour=completion_time.hour + int(estimated_hours),
        minute=int((estimated_hours % 1) * 60)
    )
    
    return completion_time.strftime("%Y-%m-%dT%H:%M:%SZ")

# Health check endpoint
@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'services': {
            'translation': 'up',
            'sentiment_analysis': 'up',
            'intelligent_routing': 'up',
            'job_recommendation': 'up'
        }
    }), 200

# Error handlers
@api_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not found',
        'timestamp': datetime.utcnow().isoformat()
    }), 404

@api_bp.errorhandler(500)
def server_error(error):
    return jsonify({
        'error': 'Internal server error',
        'timestamp': datetime.utcnow().isoformat()
    }), 500
