from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

try:
    from paddleocr import PaddleOCR
    # Initialize PaddleOCR (downloads models on first run)
    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    ocr_available = True
except ImportError:
    ocr_available = False
    print("Warning: PaddleOCR not installed. Please pip install paddlepaddle paddleocr")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ECO_KEYWORDS = ["oat", "almond", "soy", "tofu", "vegan", "plant", "vegetable", "fruit", "organic", "broccoli", "spinach", "apple", "banana"]
HIGH_IMPACT_KEYWORDS = ["beef", "meat", "pork", "lamb", "chicken", "plastic", "dairy", "cheese", "milk", "butter"]

def categorize_item(text):
    text_lower = text.lower()
    
    for kw in ECO_KEYWORDS:
        if kw in text_lower:
            return {"name": text.strip(), "impact": "low", "xp": 10, "icon": "eco"}
            
    for kw in HIGH_IMPACT_KEYWORDS:
        if kw in text_lower:
            return {"name": text.strip(), "impact": "high", "xp": 2, "icon": "warning"}
            
    # Default neutral
    return None

@app.get("/")
def read_root():
    return {"message": "Carbon Mirror API is running", "ocr_available": ocr_available}

@app.post("/scan-receipt/")
async def scan_receipt(file: UploadFile = File(...)):
    if not ocr_available:
        raise HTTPException(status_code=500, detail="PaddleOCR is not installed on the server.")

    file_location = f"temp_{file.filename}"
    try:
        # Save the uploaded file temporarily
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        # Run PaddleOCR
        result = ocr.ocr(file_location, cls=True)
        
        extracted_items = []
        if result and result[0]: # result[0] contains the lists of detections for the first image
            for line in result[0]:
                text = line[1][0] # Text content is at this index
                
                # Try to categorize the text
                categorized = categorize_item(text)
                if categorized:
                    extracted_items.append(categorized)

        # If we couldn't find anything recognizable, return a default for demo purposes
        if not extracted_items:
             extracted_items.append({"name": "Unrecognized Item", "impact": "neutral", "xp": 5, "icon": "neutral"})

        return {
            "filename": file.filename, 
            "items": extracted_items
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up temporary file
        if os.path.exists(file_location):
            os.remove(file_location)
