import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

LANG_MAP = {
    "uk": "Ukrainian",
    "en": "English",
    "de": "Deutsch"
}

VALIDATION_PROMPT = """Look at this document. Is it a German rental contract (Mietvertrag) 
or any housing/rental related document?

Reply with ONLY: YES or NO"""

async def validate_contract(file_data: dict) -> bool:
    """Перевіряємо чи це взагалі договір оренди"""
    if file_data["type"] == "text":
        content = [{"type": "text", "text": VALIDATION_PROMPT + f"\n\nDOCUMENT:\n{file_data['content'][:3000]}"}]
    else:
        content = [
            {"type": "image", "source": {"type": "base64", "media_type": file_data["media_type"], "data": file_data["content"]}},
            {"type": "text", "text": VALIDATION_PROMPT}
        ]

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=10,
        messages=[{"role": "user", "content": content}]
    )

    answer = message.content[0].text.strip().upper()
    return "YES" in answer


async def analyze_contract(file_data: dict, lang: str = "en") -> dict:
    lang_name = LANG_MAP.get(lang, "English")

    # Спочатку валідуємо
    is_valid = await validate_contract(file_data)
    if not is_valid:
        validation_errors = {
    "en": "This document doesn't appear to be a German rental contract. Please upload a Mietvertrag PDF or image.",
    "de": "Dieses Dokument scheint kein deutscher Mietvertrag zu sein. Bitte laden Sie einen Mietvertrag als PDF oder Bild hoch.",
    "uk": "Цей документ не схожий на німецький договір оренди. Будь ласка, завантажте Mietvertrag у форматі PDF або зображення.",
}
        raise ValueError(validation_errors.get(lang, validation_errors["en"]))

    prompt_text = f"""You are an expert in German Mietrecht. Analyze this rental contract.

Return ONLY a valid JSON object (no markdown, no explanation):
{{
    "critical_risks": [
        {{
            "clause": "exact quote from contract",
            "problem": "why it's illegal",
            "law": "§ BGB reference",
            "advice": "what to do"
        }}
    ],
    "moderate_risks": [
        {{
            "clause": "exact quote",
            "problem": "potential issue",
            "law": "reference if any",
            "advice": "how to protect yourself"
        }}
    ],
    "all_good": ["list of compliant clauses"],
    "conclusion": "1-2 sentence overall assessment"
}}

Check: Kaution §551, Schönheitsreparaturen BGH, Zugangsrecht §535,
Kündigungsfrist §573c, Mieterhöhung §558, Nebenkosten §556,
Kleinreparaturklausel (max 110€), Farbdiktat BGH, Modernisierungsumlage §559.

Respond ONLY in: {lang_name}"""

    # Будуємо контент залежно від типу файлу
    if file_data["type"] == "text":
        content = [{"type": "text", "text": prompt_text + f"\n\nCONTRACT:\n{file_data['content']}"}]
    else:
        content = [
            {"type": "image", "source": {"type": "base64", "media_type": file_data["media_type"], "data": file_data["content"]}},
            {"type": "text", "text": prompt_text}
        ]

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": content}]
    )

    raw = message.content[0].text.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw.strip())