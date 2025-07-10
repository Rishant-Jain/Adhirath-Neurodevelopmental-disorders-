from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["adhirath"]
collection = db["assessments"]

def save_user_input(input_dict: dict):
    collection.insert_one(input_dict)
