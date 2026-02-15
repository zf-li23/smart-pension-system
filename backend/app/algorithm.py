from typing import List, Dict
import math
from .schemas import ElderQuestionnaire, NursingHomeQuestionnaire, ElderVector, MatchResult, DimensionMatch
from .models import NursingHome

# Coefficients for normalization (example values, can be tuned)
MAX_MEDICAL_SCORE = 15.0
MAX_LIFE_SCORE = 15.0
MAX_SPIRITUAL_SCORE = 15.0
MAX_TRAFFIC_SCORE = 10.0

def normalize(score, max_score, target_min=1, target_max=5):
    # Linear mapping from [0, max_score] to [target_min, target_max]
    ratio = min(max(score / max_score, 0), 1)
    return target_min + (target_max - target_min) * ratio

def evaluate_elder_needs(data: ElderQuestionnaire) -> ElderVector:
    # 1. Medical
    med_score = 0
    med_score += min(data.chronic_disease_count, 3) * 2 # 0-6
    if data.need_monitor: med_score += 3
    if data.need_rehab: med_score += 3
    if data.need_device: med_score += 3
    
    medical_vector = normalize(med_score, MAX_MEDICAL_SCORE)
    
    # 2. Life (ADL)
    life_score = 0
    if not data.can_eat_independently: life_score += 5
    if not data.can_wash_independently: life_score += 5
    if data.mobility == "bedridden": life_score += 5
    elif data.mobility == "assisted": life_score += 3
    
    life_vector = normalize(life_score, MAX_LIFE_SCORE)
    
    # 3. Spiritual
    spir_score = 0
    if data.cognitive_status == "severe": spir_score += 5
    elif data.cognitive_status == "mild": spir_score += 3
    
    if data.loneliness_level == "high": spir_score += 5
    elif data.loneliness_level == "medium": spir_score += 3
    
    spir_score += min(data.social_need_freq, 5) # 0-5
    
    spiritual_vector = normalize(spir_score, MAX_SPIRITUAL_SCORE)
    
    # 4. Traffic/Visit
    traffic_score = 0
    # Closer distance -> Lower "Traffic Requirement"? 
    # Actually, if I need frequent visits, I need higher Traffic Convenience capability from the home.
    # So High Visit Freq -> High Traffic Requirement score.
    # Short Distance Desired -> High Traffic Requirement score.
    
    visit_weight = min(data.visit_freq_needed, 5) # 0-5
    dist_weight = 0
    if data.family_distance_km < 5: dist_weight = 5
    elif data.family_distance_km < 10: dist_weight = 3
    else: dist_weight = 1
    
    if data.need_pickup: traffic_score += 2
    
    traffic_score += visit_weight + dist_weight
    
    traffic_vector = normalize(traffic_score, MAX_TRAFFIC_SCORE)

    # 5. Service Type
    # Mapping string to a vector weight isn't direct 1-to-1, handled in matching logic
    
    return ElderVector(
        medical=round(medical_vector, 2),
        life=round(life_vector, 2),
        spiritual=round(spiritual_vector, 2),
        traffic=round(traffic_vector, 2),
        service_type_weight=1.0, 
        budget=data.max_budget
    )

def evaluate_nursing_home(data: NursingHomeQuestionnaire) -> NursingHome:
    # 1. Medical Cap
    med_score = 0
    if data.has_infirmary: med_score += 5
    med_score += min(data.rehab_equip_count, 5)
    if data.has_emergency: med_score += 3
    if data.hospital_coop: med_score += 2
    
    # 2. Life Service
    life_score = 0
    if data.care_grade == "full_care": life_score += 5
    elif data.care_grade == "semi_care": life_score += 3
    elif data.care_grade == "self_care": life_score += 1
    
    if data.special_diet: life_score += 2
    life_score += data.barrier_free_score # 1-5
    if data.safety_facilities: life_score += 3
    
    # 3. Spiritual
    spir_score = 0
    if data.activity_freq == "daily": spir_score += 5
    else: spir_score += 2
    if data.psych_support: spir_score += 5
    
    # 4. Traffic
    traff_score = 0
    if data.location_type == "center": traff_score += 5
    else: traff_score += 2
    if data.public_transport: traff_score += 3
    if data.shuttle_service: traff_score += 2
    
    # Normalize
    return NursingHome(
        name=data.name,
        address=data.address,
        contact=data.contact,
        medical_score=round(normalize(med_score, 15.0), 2),
        life_score=round(normalize(life_score, 15.0), 2),
        spiritual_score=round(normalize(spir_score, 10.0), 2),
        traffic_score=round(normalize(traff_score, 10.0), 2),
        service_types=",".join(data.service_types),
        price=data.price,
        description=data.description
    )

def calculate_match_score(req: ElderVector, home: NursingHome, desired_service_type: str) -> MatchResult:
    # Hard Filter: Service Type
    if desired_service_type not in home.service_types.split(','):
        return None # Or specific low score
    
    # Hard Filter: Budget (Softened)
    # If price > budget * 1.2 -> Reject?
    # User requirement: If price <= budget, score=1, else budget/price
    price_score = 1.0
    if home.price > req.budget:
        price_score = req.budget / home.price
        
    # Dimension Scores
    # Formula: min(supply, need) / need
    # Adjusted: If supply >= need, score 100%. If supply < need, penalty.
    # Also added bonus for supply > need? User said: "All satisfy -> candidate list". 
    
    def dim_score(supply, need):
        if need <= 0.1: return 1.0 # Avoid div by zero
        return min(supply, need) / need

    medical_s = dim_score(home.medical_score, req.medical)
    life_s = dim_score(home.life_score, req.life)
    spiritual_s = dim_score(home.spiritual_score, req.spiritual)
    traffic_s = dim_score(home.traffic_score, req.traffic)
    
    # Weights
    # Service Type > Medical > Life > Spiritual > Traffic > Price
    # 0.3, 0.2, 0.2, 0.15, 0.1, 0.05
    w_med = 0.25
    w_life = 0.25
    w_spir = 0.20
    w_traff = 0.15
    w_price = 0.15
    
    total_score = (
        medical_s * w_med +
        life_s * w_life +
        spiritual_s * w_spir +
        traffic_s * w_traff +
        price_score * w_price
    )
    
    details = []
    
    def get_status(supply, need):
        if supply >= need: return "Satisfied"
        return "Insufficient" # Simple logic for now
    
    details.append(DimensionMatch(
        dimension="Medical", score=medical_s, user_val=req.medical, home_val=home.medical_score,
        status=get_status(home.medical_score, req.medical), 
        comment=f"Need {req.medical}, has {home.medical_score}"
    ))
    details.append(DimensionMatch(
        dimension="Life Care", score=life_s, user_val=req.life, home_val=home.life_score,
        status=get_status(home.life_score, req.life),
        comment=f"Need {req.life}, has {home.life_score}"
    ))
    details.append(DimensionMatch(
        dimension="Spiritual", score=spiritual_s, user_val=req.spiritual, home_val=home.spiritual_score,
        status=get_status(home.spiritual_score, req.spiritual),
        comment=f"Need {req.spiritual}, has {home.spiritual_score}"
    ))
    details.append(DimensionMatch(
        dimension="Traffic", score=traffic_s, user_val=req.traffic, home_val=home.traffic_score,
        status=get_status(home.traffic_score, req.traffic),
        comment=f"Need {req.traffic}, has {home.traffic_score}"
    ))
    details.append(DimensionMatch(
        dimension="Price", score=price_score, user_val=req.budget, home_val=home.price,
        status="Satisfied" if home.price <= req.budget else "Over Budget",
        comment=f"Budget {req.budget}, Price {home.price}"
    ))

    # Generate Summary
    summary = f"Matching Score: {int(total_score*100)}%. "
    if total_score > 0.9: summary += "Excellent match!"
    elif total_score > 0.7: summary += "Good match."
    else: summary += "Some needs may not be fully met."
    
    return MatchResult(
        home=home,
        total_match_score=round(total_score * 100, 1),
        dimension_details=details,
        summary=summary
    )
