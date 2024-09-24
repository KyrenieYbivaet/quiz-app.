import requests


def translate_text(text, source_lang='en', target_lang='ru'):
    url = f"https://ftapi.pythonanywhere.com/translate?sl={source_lang}&dl={target_lang}&text={text}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('destination-text', text)  # Возвращаем переведенный текст или исходный
    else:
        raise Exception("Ошибка при переводе: " + response.text)
