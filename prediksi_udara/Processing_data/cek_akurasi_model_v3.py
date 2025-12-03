import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

print("=== CEK AKURASI MODEL V3 ===")

# ==============================
# 1. BACA DATASET FINAL
# ==============================
df = pd.read_csv("dataset_kualitas_udara_beijing_final.csv")

X = df[["suhu", "kelembapan", "tekanan", "kecepatan_angin"]]
y = df["kualitas_udara"]

print("\nJumlah total data:", len(df))

# ==============================
# 2. LOAD SCALER & MODEL V3
# ==============================
scaler = joblib.load("scaler_beijing_v3.pkl")
model = joblib.load("model_kualitas_udara_beijing_v3.pkl")

# ==============================
# 3. NORMALISASI DATA
# ==============================
X_scaled = scaler.transform(X)

# ==============================
# 4. SPLIT DATA (SAMA SEPERTI TRAINING)
# ==============================
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Jumlah data testing:", len(X_test))

# ==============================
# 5. PREDIKSI & HITUNG AKURASI
# ==============================
y_pred = model.predict(X_test)

akurasi = accuracy_score(y_test, y_pred)

print("\nAKURASI MODEL V3:", akurasi)
print("\nLAPORAN KLASIFIKASI MODEL V3:")
print(classification_report(y_test, y_pred))

print("\n=== CEK AKURASI SELESAI ===")
