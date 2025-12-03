"""
Script untuk melatih model Random Forest dan menyimpannya.
Jalankan script ini terlebih dahulu sebelum menjalankan API.
"""
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
import os

print("=== TRAINING MODEL KUALITAS UDARA ===\n")

# Path ke file
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(CURRENT_DIR, "dataset_kualitas_udara_beijing_final.csv")
MODEL_PATH = os.path.join(CURRENT_DIR, "model_kualitas_udara_beijing_v3.pkl")
SCALER_PATH = os.path.join(CURRENT_DIR, "scaler_beijing_v3.pkl")

# =====================================
# 1. BACA DATASET
# =====================================
print("1. Membaca dataset...")
df = pd.read_csv(DATASET_PATH)

print(f"   Total data: {len(df)} baris")
print(f"   Kolom: {list(df.columns)}")

# =====================================
# 2. DEFINISI FITUR & LABEL
# =====================================
X = df[["suhu", "kelembapan", "tekanan", "kecepatan_angin"]]
y = df["kualitas_udara"]

print("\n2. Distribusi kualitas udara:")
print(y.value_counts())

# =====================================
# 3. SPLIT TRAIN-TEST
# =====================================
print("\n3. Membagi data train-test...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
print(f"   Data training: {len(X_train)}")
print(f"   Data testing: {len(X_test)}")

# =====================================
# 4. NORMALISASI
# =====================================
print("\n4. Melakukan normalisasi data...")
scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Simpan scaler
joblib.dump(scaler, SCALER_PATH)
print(f"   Scaler disimpan: {SCALER_PATH}")

# =====================================
# 5. SEIMBANGKAN DATA (SMOTE)
# =====================================
print("\n5. Menyeimbangkan data dengan SMOTE...")
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)
print(f"   Data setelah SMOTE: {len(X_train_res)}")

# =====================================
# 6. TRAINING RANDOM FOREST
# =====================================
print("\n6. Melatih model Random Forest...")
# Konfigurasi lebih ringan untuk memory terbatas
model = RandomForestClassifier(
    n_estimators=100,       # Kurangi dari 400 ke 100 untuk hemat memory
    max_depth=15,           # Kurangi dari 18 ke 15
    min_samples_leaf=4,     # Tambah dari 2 ke 4 untuk tree lebih kecil
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=2                # Batasi jobs agar tidak kehabisan memory
)

model.fit(X_train_res, y_train_res)
print("   Model berhasil dilatih!")

# =====================================
# 7. EVALUASI
# =====================================
print("\n7. Evaluasi model...")
y_pred = model.predict(X_test_scaled)

akurasi = accuracy_score(y_test, y_pred)
print(f"\n   AKURASI: {akurasi:.4f} ({akurasi*100:.2f}%)")

print("\n   LAPORAN KLASIFIKASI:")
print(classification_report(y_test, y_pred))

# =====================================
# 8. SIMPAN MODEL
# =====================================
joblib.dump(model, MODEL_PATH)
print(f"\n8. Model disimpan: {MODEL_PATH}")

print("\n=== TRAINING SELESAI ===")
print(f"\nFile yang dihasilkan:")
print(f"  - {MODEL_PATH}")
print(f"  - {SCALER_PATH}")
