import os
import sys

# Add the current directory to sys.path so that 'app' can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# Vercel Serverless Function entry point
# This file exposes the FastAPI app instance for Vercel's WSGI/ASGI adapter.

