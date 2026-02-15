from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud, algorithm, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Pension System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    # Ensure database tables are created (especially if using /tmp which might be empty on new instance)
    models.Base.metadata.create_all(bind=database.engine)
    
    db = database.SessionLocal()
    try:
        if db.query(models.NursingHome).count() == 0:
            homes = [
                models.NursingHome(
                name="Nursing Home A (Comprehensive)", 
                address="123 Health St", 
                contact="555-0001",
                medical_score=5.0, life_score=4.0, spiritual_score=3.0, traffic_score=4.0,
                service_types="long_term,day_care", price=4000
            ),
            models.NursingHome(
                name="Nursing Home B (Spiritual Focus)", 
                address="456 Care Ln", 
                contact="555-0002",
                medical_score=3.0, life_score=3.0, spiritual_score=5.0, traffic_score=2.0,
                service_types="long_term", price=3000
            ),
            models.NursingHome(
                name="Nursing Home C (Community/Day)", 
                address="789 Community Rd", 
                contact="555-0003",
                medical_score=2.0, life_score=2.0, spiritual_score=2.0, traffic_score=5.0,
                service_types="day_care", price=2000
            ),
        ]
        for home in homes:
            db.add(home)
        db.commit()
    finally:
        db.close()
            if res:
                results.append(res)
                
        # 5. Sort by Total Score Descending
        results.sort(key=lambda x: x.total_match_score, reverse=True)
        
        return results[:3] # Top 3
    except Exception as e:
        print(f"Error evaluating elder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/evaluate/home_questionnaire", response_model=schemas.NursingHome)
def evaluate_home_q(q: schemas.NursingHomeQuestionnaire, db: Session = Depends(get_db)):
    home_model = algorithm.evaluate_nursing_home(q)
    return crud.create_nursing_home(db, home_model)
