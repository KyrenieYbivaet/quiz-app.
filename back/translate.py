import requests

def translate_text(text):
    url = "https://libretranslate.de/translate"
    payload = {
        "q": text,
        "source": "en",
        "target": "ru",
        "format": "text"
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json()["translatedText"]
    else:
        return text  # Вернуть оригинальный текст в случае ошибки
