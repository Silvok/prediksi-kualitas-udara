"""
Flask API untuk Prediksi Kualitas Udara
Menggunakan model Random Forest yang sudah dilatih
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Izinkan akses dari frontend

# =====================================
# LOAD MODEL & SCALER
# =====================================
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "model_kualitas_udara_beijing_v3.pkl")
SCALER_PATH = os.path.join(CURRENT_DIR, "scaler_beijing_v3.pkl")
DATASET_PATH = os.path.join(CURRENT_DIR, "dataset_kualitas_udara_beijing_final.csv")

# Load model dan scaler
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model dan Scaler berhasil dimuat!")
except Exception as e:
    print(f"❌ Error loading model/scaler: {e}")
    print("⚠️  Jalankan train_model.py terlebih dahulu!")
    model = None
    scaler = None

# Load dataset untuk statistik
try:
    df = pd.read_csv(DATASET_PATH)
    print(f"✅ Dataset dimuat: {len(df)} data")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    df = None


def get_confidence_score(probabilities):
    """Menghitung skor kepercayaan berdasarkan probabilitas prediksi"""
    max_prob = max(probabilities) * 100
    return round(max_prob, 2)


def get_feedback(suhu, kelembapan, tekanan, kecepatan_angin, kualitas):
    """Menghasilkan feedback berdasarkan parameter input"""
    feedback = []
    
    # Berdasarkan analisis dataset Beijing
    # Suhu: rentang -17 sampai 41°C
    if -20 <= suhu <= 40:
        feedback.append("✓ Suhu dalam rentang normal untuk Beijing")
    else:
        feedback.append("✗ Suhu di luar rentang normal dataset")
    
    # Kelembapan (DEWP/Dew Point): rentang -40 sampai 28
    if -40 <= kelembapan <= 30:
        feedback.append("✓ Titik embun (kelembapan) dalam rentang normal")
    else:
        feedback.append("✗ Titik embun di luar rentang normal dataset")
    
    # Tekanan: rentang 991 sampai 1042 mb
    if 990 <= tekanan <= 1045:
        feedback.append("✓ Tekanan udara dalam rentang normal")
    else:
        feedback.append("✗ Tekanan udara di luar rentang normal dataset")
    
    # Kecepatan angin: rentang 0 sampai 13 m/s
    if 0 <= kecepatan_angin <= 15:
        feedback.append("✓ Kecepatan angin dalam rentang normal")
    else:
        feedback.append("✗ Kecepatan angin di luar rentang normal dataset")
    
    # Feedback berdasarkan kualitas udara
    if kualitas == "Baik":
        feedback.append("✓ Kondisi cuaca mendukung kualitas udara baik")
    elif kualitas == "Sedang":
        feedback.append("⚠ Kondisi cuaca menghasilkan kualitas udara sedang")
    else:
        feedback.append("✗ Kondisi cuaca menghasilkan kualitas udara buruk")
    
    return feedback


# =====================================
# API ENDPOINTS
# =====================================

@app.route("/", methods=["GET"])
def home():
    """Endpoint untuk health check"""
    return jsonify({
        "status": "ok",
        "message": "API Prediksi Kualitas Udara Beijing",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "dataset_loaded": df is not None,
        "endpoints": {
            "predict": "POST /predict",
            "stats": "GET /stats",
            "health": "GET /health"
        }
    })


@app.route("/health", methods=["GET"])
def health():
    """Endpoint untuk mengecek status API"""
    return jsonify({
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "dataset_rows": len(df) if df is not None else 0
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint untuk prediksi kualitas udara
    
    Request Body:
    {
        "suhu": float,          # Temperatur dalam °C
        "kelembapan": float,    # Dew Point / Titik Embun
        "tekanan": float,       # Tekanan udara dalam mb
        "kecepatan_angin": float # Kecepatan angin dalam m/s
    }
    """
    if model is None or scaler is None:
        return jsonify({
            "error": "Model belum dimuat. Jalankan train_model.py terlebih dahulu."
        }), 500
    
    try:
        data = request.get_json()
        
        # Validasi input
        required_fields = ["suhu", "kelembapan", "tekanan", "kecepatan_angin"]
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Field '{field}' tidak ditemukan"
                }), 400
        
        # Ambil nilai input
        suhu = float(data["suhu"])
        kelembapan = float(data["kelembapan"])
        tekanan = float(data["tekanan"])
        kecepatan_angin = float(data["kecepatan_angin"])
        
        # =====================================
        # VALIDASI RANGE INPUT (KETAT)
        # Berdasarkan dataset Beijing Air Quality
        # =====================================
        VALID_RANGES = {
            "suhu": {"min": -20, "max": 40, "unit": "°C", "label": "Suhu"},
            "kelembapan": {"min": -40, "max": 30, "unit": "", "label": "Titik Embun (Kelembapan)"},
            "tekanan": {"min": 990, "max": 1045, "unit": "mb", "label": "Tekanan Udara"},
            "kecepatan_angin": {"min": 0, "max": 15, "unit": "m/s", "label": "Kecepatan Angin"}
        }
        
        validation_errors = []
        
        # Validasi setiap parameter
        if not (VALID_RANGES["suhu"]["min"] <= suhu <= VALID_RANGES["suhu"]["max"]):
            validation_errors.append({
                "field": "suhu",
                "message": f"Suhu harus antara {VALID_RANGES['suhu']['min']}°C sampai {VALID_RANGES['suhu']['max']}°C. Nilai Anda: {suhu}°C"
            })
        
        if not (VALID_RANGES["kelembapan"]["min"] <= kelembapan <= VALID_RANGES["kelembapan"]["max"]):
            validation_errors.append({
                "field": "kelembapan",
                "message": f"Titik Embun harus antara {VALID_RANGES['kelembapan']['min']} sampai {VALID_RANGES['kelembapan']['max']}. Nilai Anda: {kelembapan}"
            })
        
        if not (VALID_RANGES["tekanan"]["min"] <= tekanan <= VALID_RANGES["tekanan"]["max"]):
            validation_errors.append({
                "field": "tekanan",
                "message": f"Tekanan Udara harus antara {VALID_RANGES['tekanan']['min']}mb sampai {VALID_RANGES['tekanan']['max']}mb. Nilai Anda: {tekanan}mb"
            })
        
        if not (VALID_RANGES["kecepatan_angin"]["min"] <= kecepatan_angin <= VALID_RANGES["kecepatan_angin"]["max"]):
            validation_errors.append({
                "field": "kecepatan_angin",
                "message": f"Kecepatan Angin harus antara {VALID_RANGES['kecepatan_angin']['min']}m/s sampai {VALID_RANGES['kecepatan_angin']['max']}m/s. Nilai Anda: {kecepatan_angin}m/s"
            })
        
        # Jika ada error validasi, tolak request
        if validation_errors:
            return jsonify({
                "success": False,
                "error": "Input di luar range yang valid",
                "validation_errors": validation_errors,
                "valid_ranges": {
                    "suhu": f"{VALID_RANGES['suhu']['min']} sampai {VALID_RANGES['suhu']['max']} °C",
                    "kelembapan": f"{VALID_RANGES['kelembapan']['min']} sampai {VALID_RANGES['kelembapan']['max']}",
                    "tekanan": f"{VALID_RANGES['tekanan']['min']} sampai {VALID_RANGES['tekanan']['max']} mb",
                    "kecepatan_angin": f"{VALID_RANGES['kecepatan_angin']['min']} sampai {VALID_RANGES['kecepatan_angin']['max']} m/s"
                }
            }), 400
        
        # Buat array input
        input_data = np.array([[suhu, kelembapan, tekanan, kecepatan_angin]])
        
        # Normalisasi input
        input_scaled = scaler.transform(input_data)
        
        # Prediksi
        prediction = model.predict(input_scaled)[0]
        probabilities = model.predict_proba(input_scaled)[0]
        
        # Hitung confidence score
        confidence = get_confidence_score(probabilities)
        
        # Mapping kualitas ke skor (untuk tampilan frontend)
        quality_scores = {
            "Baik": 85,
            "Sedang": 60,
            "Buruk": 30
        }
        
        # Mapping kualitas ke icon
        quality_icons = {
            "Baik": "✅",
            "Sedang": "⚠️",
            "Buruk": "❌"
        }
        
        # Generate feedback
        feedback = get_feedback(suhu, kelembapan, tekanan, kecepatan_angin, prediction)
        
        # Probabilitas per kelas
        class_names = model.classes_
        prob_dict = {class_names[i]: round(probabilities[i] * 100, 2) for i in range(len(class_names))}
        
        return jsonify({
            "success": True,
            "prediction": {
                "kualitas": prediction,
                "score": quality_scores.get(prediction, 50),
                "confidence": confidence,
                "icon": quality_icons.get(prediction, "❓"),
                "probabilities": prob_dict
            },
            "input": {
                "suhu": suhu,
                "kelembapan": kelembapan,
                "tekanan": tekanan,
                "kecepatan_angin": kecepatan_angin
            },
            "feedback": feedback
        })
        
    except ValueError as e:
        return jsonify({
            "error": f"Nilai input tidak valid: {str(e)}"
        }), 400
    except Exception as e:
        return jsonify({
            "error": f"Terjadi kesalahan: {str(e)}"
        }), 500


@app.route("/stats", methods=["GET"])
def stats():
    """Endpoint untuk mendapatkan statistik dataset"""
    if df is None:
        return jsonify({
            "error": "Dataset tidak ditemukan"
        }), 500
    
    # Hitung statistik
    stats_data = {
        "total_data": len(df),
        "distribusi_kualitas": df["kualitas_udara"].value_counts().to_dict(),
        "range_parameter": {
            "suhu": {
                "min": float(df["suhu"].min()),
                "max": float(df["suhu"].max()),
                "mean": float(df["suhu"].mean())
            },
            "kelembapan": {
                "min": float(df["kelembapan"].min()),
                "max": float(df["kelembapan"].max()),
                "mean": float(df["kelembapan"].mean())
            },
            "tekanan": {
                "min": float(df["tekanan"].min()),
                "max": float(df["tekanan"].max()),
                "mean": float(df["tekanan"].mean())
            },
            "kecepatan_angin": {
                "min": float(df["kecepatan_angin"].min()),
                "max": float(df["kecepatan_angin"].max()),
                "mean": float(df["kecepatan_angin"].mean())
            }
        }
    }
    
    return jsonify(stats_data)


@app.route("/sample", methods=["GET"])
def sample():
    """Endpoint untuk mendapatkan sample data dari dataset"""
    if df is None:
        return jsonify({
            "error": "Dataset tidak ditemukan"
        }), 500
    
    # Ambil 5 sample random dari setiap kualitas
    samples = []
    for kualitas in ["Baik", "Sedang", "Buruk"]:
        sample_data = df[df["kualitas_udara"] == kualitas].sample(n=min(5, len(df[df["kualitas_udara"] == kualitas])))
        samples.extend(sample_data.to_dict("records"))
    
    return jsonify({
        "samples": samples,
        "total": len(samples)
    })


if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 API Prediksi Kualitas Udara Beijing")
    print("="*50)
    print(f"📊 Model: {MODEL_PATH}")
    print(f"📈 Scaler: {SCALER_PATH}")
    print(f"📁 Dataset: {DATASET_PATH}")
    print("="*50 + "\n")
    
    # debug=False agar tidak reload dan model tetap dimuat
    app.run(host="0.0.0.0", port=5000, debug=False)
