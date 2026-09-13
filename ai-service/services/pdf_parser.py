import fitz
import base64
from fastapi import UploadFile

async def extract_content(file: UploadFile) -> dict:
    contents = await file.read()
    content_type = file.content_type or ''
    filename = file.filename or ''

    # PDF → витягуємо текст
    if filename.lower().endswith('.pdf') or 'pdf' in content_type:
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        if len(text.strip()) < 50:
            raise ValueError("Could not extract text from PDF")

        return {"type": "text", "content": text[:15000]}

    # Зображення → передаємо в Claude
    elif any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']) or \
         any(fmt in content_type for fmt in ['jpeg', 'jpg', 'png', 'webp']):

        if len(contents) > 20 * 1024 * 1024:
            raise ValueError("Image too large (max 20MB)")

        img_converted = False

        # Стискаємо якщо більше 4MB
        if len(contents) > 4 * 1024 * 1024:
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(contents))
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                max_size = (2048, 2048)
                img.thumbnail(max_size, Image.LANCZOS)
                output = io.BytesIO()
                img.save(output, format='JPEG', quality=85, optimize=True)
                contents = output.getvalue()
                img_converted = True
            except ImportError:
                raise ValueError("Image too large (max 5MB). Please compress it first.")
        else:
            # Навіть малі PNG конвертуємо в JPEG щоб уникнути проблем з media_type
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(contents))
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                    output = io.BytesIO()
                    img.save(output, format='JPEG', quality=95)
                    contents = output.getvalue()
                    img_converted = True
            except ImportError:
                pass

        media_type = 'image/jpeg' if img_converted else (content_type or 'image/jpeg')
        b64 = base64.standard_b64encode(contents).decode('utf-8')
        return {"type": "image", "content": b64, "media_type": media_type}

    else:
        raise ValueError(
            "Unsupported file format. Please upload PDF, JPG, PNG, or WEBP"
        )