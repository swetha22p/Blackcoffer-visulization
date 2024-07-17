from flask import Flask, jsonify
from flask_cors import CORS
from models import get_data

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_all_data():
    data = get_data()
    for item in data:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

