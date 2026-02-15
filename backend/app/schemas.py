from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Shared Base Models ---

class NursingHomeBase(BaseModel):
    name: str
    address: str
    contact: str
    medical_score: float
    life_score: float
    spiritual_score: float
    traffic_score: float
    service_types: str
    price: int
    description: Optional[str] = None

class NursingHomeCreate(NursingHomeBase):
    pass

class NursingHome(NursingHomeBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# --- Questionnaire Input Models ---

# Elder Questionnaire Input
class ElderQuestionnaire(BaseModel):
    # Medical
    chronic_disease_count: int # 0, 1, 2, 3+
    need_monitor: bool
    need_rehab: bool
    need_device: bool
    
    # Life
    can_eat_independently: bool
    can_wash_independently: bool
    mobility: str # "independent", "assisted", "bedridden"
    
    # Spiritual
    cognitive_status: str # "none", "mild", "severe"
    loneliness_level: str # "low", "medium", "high"
    social_need_freq: int # times per week
    
    # Visit/Traffic
    family_distance_km: float
    visit_freq_needed: int # times per week
    need_pickup: bool
    
    # Time/Service Type
    service_type: str # "long_term", "day_care", "short_term"
    
    # Budget
    max_budget: int

# Nursing Home Questionnaire Input (Simplified for API, could be detailed similarly)
class NursingHomeQuestionnaire(BaseModel):
    name: str
    address: str
    contact: str
    
    # Medical Capabilities
    has_infirmary: bool
    rehab_equip_count: int
    has_emergency: bool
    hospital_coop: bool
    
    # Life Service
    care_grade: str # "self_care", "semi_care", "full_care"
    special_diet: bool
    barrier_free_score: int # 1-5
    safety_facilities: bool
    
    # Spiritual
    activity_freq: str # "daily", "weekly"
    psych_support: bool
    
    # Traffic
    location_type: str # "center", "suburb"
    public_transport: bool
    shuttle_service: bool
    
    # Other
    service_types: List[str]
    price: int
    description: str

# --- Evaluation Output Models ---

class DimensionMatch(BaseModel):
    dimension: str
    score: float # 0-1 or percentage
    user_val: float
    home_val: float
    status: str # "satisfied", "shortage", "excess"
    comment: str

class MatchResult(BaseModel):
    home: NursingHome
    total_match_score: float
    dimension_details: List[DimensionMatch]
    summary: str

class ElderVector(BaseModel):
    medical: float
    life: float
    spiritual: float
    traffic: float # Combined Visit/Traffic
    service_type_weight: float # Just a representation
    budget: int
