from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

# Load port and host from environment variables, defaulting to 3000 and '0.0.0.0' respectively
port = int(os.getenv("PORT", 3000))
host = os.getenv("HOST", "0.0.0.0")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Allow all origins for API routes

# Resolve the path to the CSV file correctly using os.path
csv_file_path = os.path.join(os.path.dirname(__file__), 'data', 'finalized_dataset.csv')

# Check if the file exists before attempting to load it
if os.path.exists(csv_file_path):
    data = pd.read_csv(csv_file_path)
else:
    data = None
    print(f"CSV file not found at {csv_file_path}")

@app.route('/api/data', methods=['GET'])
def get_data():
    if data is not None:
        data_dict = data.to_dict(orient='records')
        return jsonify({"message": "Repository Data", "data": data_dict})
    else:
        return jsonify({"error": "Data file not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host=host, port=port)
