from sqlalchemy.orm import Session
from . import models, schemas

def get_nursing_homes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.NursingHome).offset(skip).limit(limit).all()

def create_nursing_home(db: Session, home: models.NursingHome):
    db.add(home)
    db.commit()
    db.refresh(home)
    return home

def create_elder_req(db: Session, req: models.ElderRequirement):
    db.add(req)
    db.commit()
    db.refresh(req)
    return req
