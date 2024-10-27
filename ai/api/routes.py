from flask import Blueprint, request, jsonify
from ..models.intelligent_routing.model import IntelligentRoutingModel
from ..models.intelligent_routing.preprocessor import GrievancePreprocessor
from ..config.config import Config
import torch
import datetime

routing_bp = Blueprint('routing', __name__)

# Initialize model and preprocessor
config = Config()
preprocessor = GrievancePreprocessor()
model = IntelligentRoutingModel(
    input_size=preprocessor._calculate_input_size(),
    hidden_size=128,
    num_staff=50
)

# Load trained model
checkpoint = torch.load(config.MODEL_DIR / "trained_model.pth")
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

@routing_bp.route('/api/intelligent-routing', methods=['POST'])
def route_grievance():
    try:
        # Get grievance data from request
        grievance_data = request.get_json()
        
        # Validate input
        if not _validate_grievance_data(grievance_data):
            return jsonify({
                'error': 'Invalid grievance data format'
            }), 400
            
        # Preprocess grievance
        grievance_features = preprocessor.preprocess_grievance(grievance_data)
        grievance_tensor = torch.FloatTensor(grievance_features)
        
        # Get model prediction
        with torch.no_grad():
            action_probs = model(grievance_tensor)
        
        # Get assigned staff ID
        assigned_staff_id = torch.argmax(action_probs).item()
        
        # Prepare response
        response = {
            'grievance_id': grievance_data['grievance_id'],
            'assigned_staff_id': f"S{assigned_staff_id:05d}",
            'assignment_timestamp': datetime.now().isoformat(),
            'expected_resolution_time': '1 hour',  # This could be dynamic
            'floor_number': grievance_data['floor_number'],
            'hostel_name': grievance_data['hostel_name'],
            'student_room_no': grievance_data['student_room_no']
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

def _validate_grievance_data(data):
    """Validate incoming grievance data"""
    required_fields = [
        'grievance_id', 'category', 'floor_number',
        'hostel_name', 'student_room_no'
    ]
    
    # Check required fields
    if not all(field in data for field in required_fields):
        return False
        
    # Validate category
    if data['category'] not in Config.VALID_CATEGORIES:
        return False
        
    # Validate floor number
    if data['floor_number'] not in Config.VALID_FLOOR_NUMBERS:
        return False
        
    # Validate hostel name
    if data['hostel_name'] not in Config.VALID_HOSTELS:
        return False
        
    return True
