from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config.from_object('config.Config')

mongo = PyMongo(app)

def get_data():
    collection = mongo.db.data
    return list(collection.find())
