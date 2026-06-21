import os
import uuid
import logging
import asyncio
from functools import partial
import aiofiles
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
from dotenv import load_dotenv

# Rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Carbon Mirror API",
    description="OCR and Vision AI backend for carbon footprint tracking",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,https://karanmantrii.github.io").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# Initialize Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

_ocr = None
def get_ocr():
    global _ocr
    if _ocr is None:
        try:
            from paddleocr import PaddleOCR
            _ocr = PaddleOCR(use_angle_cls=True, lang='en')
        except ImportError:
            logger.error("PaddleOCR not installed.")
            return None
    return _ocr

ECO_KEYWORDS = ["oat", "almond", "soy", "tofu", "vegan", "plant", "vegetable", "fruit", "organic", "broccoli", "spinach", "apple", "banana"]
HIGH_IMPACT_KEYWORDS = ["beef", "meat", "pork", "lamb", "chicken", "plastic", "dairy", "cheese", "milk", "butter"]

class ScannedItem(BaseModel):
    name: str
    impact: Literal["low", "high", "neutral"]
    xp: int
    icon: str

class ScanResponse(BaseModel):
    filename: str
    items: List[ScannedItem]

class VisionRequest(BaseModel):
    image: str

def categorize_item(text: str) -> Optional[ScannedItem]:
    """Categorize a text string as eco-friendly, high-impact, or None."""
    text_lower = text.lower()
    for kw in ECO_KEYWORDS:
        if kw in text_lower:
            return ScannedItem(name=text.strip(), impact="low", xp=10, icon="eco")
    for kw in HIGH_IMPACT_KEYWORDS:
        if kw in text_lower:
            return ScannedItem(name=text.strip(), impact="high", xp=2, icon="warning")
    return None

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
    }

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE_MB = 10

@app.post("/scan-receipt/", response_model=ScanResponse, summary="Scan a receipt image")
@limiter.limit("10/minute")
async def scan_receipt(request: Request, file: UploadFile = File(...)):
    """Accepts a receipt image, runs OCR, and returns categorized grocery items."""
    ocr_instance = get_ocr()
    if not ocr_instance:
        raise HTTPException(status_code=500, detail="OCR engine unavailable.")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' not allowed.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large.")

    safe_name = f"temp_{uuid.uuid4().hex}{ext}"
    file_location = os.path.join(os.getcwd(), safe_name) # simplified temp

    try:
        async with aiofiles.open(file_location, "wb") as f:
            await f.write(contents)

        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, partial(ocr_instance.ocr, file_location, cls=True))
        
        extracted_items = []
        if result and result[0]:
            for line in result[0]:
                text = line[1][0]
                cat = categorize_item(text)
                if cat:
                    extracted_items.append(cat)

        if not extracted_items:
            extracted_items.append(ScannedItem(name="Unrecognized Item", impact="neutral", xp=5, icon="neutral"))

        return ScanResponse(filename=file.filename or "receipt", items=extracted_items)

    except Exception as e:
        logger.exception("Receipt scan failed")
        raise HTTPException(status_code=500, detail="Internal processing error")
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)

@app.post("/api/vision")
@limiter.limit("10/minute")
async def vision_proxy(request: Request, body: VisionRequest):
    """Proxy endpoint for Gemini API"""
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="AI backend not configured.")
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        prompt = """
        Analyze this image and identify the main object. 
        Determine its carbon impact (low, medium, high) and an estimated carbon cost in grams.
        Provide actionable alternatives.
        
        Respond ONLY with a valid JSON object in this exact format:
        {
          "object": "Brief Name",
          "impact": "low|medium|high",
          "carbonCost": 120,
          "alternatives": ["Alt 1", "Alt 2"]
        }
        """
        
        response = await asyncio.to_thread(
            model.generate_content, 
            [{"mime_type": "image/jpeg", "data": body.image}, prompt]
        )
        return {"response": response.text}
    except Exception as e:
        logger.exception("Vision proxy failed")
        raise HTTPException(status_code=500, detail="AI processing error")
