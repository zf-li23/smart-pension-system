from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use /tmp for Vercel serverless environment (ephemeral but writable)
if os.environ.get("VERCEL"):
    # /tmp is the only writable directory in Vercel serverless functions
    SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/pension.db"
else:
    # Use absolute path for local development to avoid CWD issues
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '../pension.db')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
