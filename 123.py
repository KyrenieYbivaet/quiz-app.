from back.app import db

db.drop_all()  # удаляет все таблицы
db.create_all()