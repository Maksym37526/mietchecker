from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from services.pdf_parser import extract_content
from services.claude_analyzer import analyze_contract
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MietChecker AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_endpoint(
    file: UploadFile = File(...),
    lang: str = Query(default="en")
):
    filename = file.filename or ''
    allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
    if not any(filename.lower().endswith(ext) for ext in allowed):
        raise HTTPException(400, "Unsupported format. Use PDF, JPG, PNG, or WEBP")

    try:
        file_data = await extract_content(file)
        report = await analyze_contract(file_data, lang)

        return {
            "status": "completed",
            "file_name": filename,
            "language": lang,
            **report
        }
    except ValueError as e:
        raise HTTPException(422, str(e))
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)