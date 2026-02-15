from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class NursingHome(Base):
    __tablename__ = "nursing_homes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    contact = Column(String)
    
    # 6 Dimensions
    medical_score = Column(Float)
    life_score = Column(Float)
    spiritual_score = Column(Float)
    traffic_score = Column(Float)
    service_types = Column(String) # Stored as comma separated string
    price = Column(Integer)
    
    description = Column(Text, nullable=True) # For interpretability/comprehensive summary
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ElderRequirement(Base):
    __tablename__ = "elder_requirements"

    id = Column(Integer, primary_key=True, index=True)
    
    # Needs (1-5)
    medical_need = Column(Float)
    life_need = Column(Float)
    spiritual_need = Column(Float)
    traffic_need = Column(Float)
    visit_need = Column(Float) # Often correlates with Traffic but kept separate in requirement vector
    
    # Additional constraints
    max_budget = Column(Integer)
    required_service_type = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
