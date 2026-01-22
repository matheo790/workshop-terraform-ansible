from flask import Flask, jsonify
import os, socket, datetime

app = Flask(__name__)

@app.get("/")
def home():
    return jsonify(
        message="Hello from Flask (local DevOps lab)!",
        hostname=socket.gethostname(),
        env=os.getenv("APP_ENV", "dev"),
        time=datetime.datetime.utcnow().isoformat() + "Z",
    )

@app.get("/health")
def health():
    return jsonify(status="ok")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
