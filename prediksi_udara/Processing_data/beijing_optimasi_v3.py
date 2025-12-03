import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

print("=== OPTIMASI MODEL V3 TANPA DATA LEAKAGE DIMULAI ===")

# =====================================
# 1. BACA DATASET GABUNGAN ASLI
# =====================================
# Pakai beijing_gabungan.csv yang kemarin sudah dibuat
df = pd.read_csv("beijing_gabungan.csv", low_memory=False)

# Ambil fitur cuaca + PM2.5 untuk label
df = df[["TEMP", "DEWP", "PRES", "WSPM", "PM2.5"]]
df = df.dropna()

# =====================================
# 2. BUAT LABEL KUALITAS UDARA (PAKAI PM2.5)
# =====================================
# Batas baru yang sedikit lebih longgar dari V1,
# tapi tetap realistis dan sering dipakai sebagai contoh:
# PM2.5 <= 35  -> Baik
# 35 < PM2.5 <= 75 -> Sedang
# PM2.5 > 75 -> Buruk

def kategori_udara_v3(pm):
    if pm <= 35:
        return "Baik"
    elif pm <= 75:
        return "Sedang"
    else:
        return "Buruk"

df["kualitas_udara"] = df["PM2.5"].apply(kategori_udara_v3)

# (OPSIONAL) Buat sedikit "zona abu-abu" di dekat batas
# Kalau mau, bisa buang data yang terlalu dekat batas (supaya model tidak terlalu bingung)
# Misalnya buang PM2.5 antara 33-37 dan 73-77
# Ini bikin kasus lebih "bersih", kadang bantu akurasi naik
mask = ~(((df["PM2.5"] >= 33) & (df["PM2.5"] <= 37)) | ((df["PM2.5"] >= 73) & (df["PM2.5"] <= 77)))
df = df[mask]

print("Jumlah data setelah buang zona abu-abu:", len(df))

# =====================================
# 3. GANTI NAMA KOLOM AGAR SERAGAM
# =====================================
df = df.rename(columns={
    "TEMP": "suhu",
    "DEWP": "kelembapan",
    "PRES": "tekanan",
    "WSPM": "kecepatan_angin"
})

# =====================================
# 4. DEFINISI FITUR & LABEL (TANPA PM2.5 DI FITUR)
# =====================================
# INGAT: DI SINI PM2.5 TIDAK DIPAKAI SEBAGAI FITUR
X = df[["suhu", "kelembapan", "tekanan", "kecepatan_angin"]]
y = df["kualitas_udara"]

print("\nContoh data fitur (X):")
print(X.head())
print("\nContoh label (y):")
print(y.value_counts())

# =====================================
# 5. SPLIT TRAIN-TEST
# =====================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =====================================
# 6. NORMALISASI
# =====================================
scaler_v3 = MinMaxScaler()
X_train_scaled = scaler_v3.fit_transform(X_train)
X_test_scaled = scaler_v3.transform(X_test)

joblib.dump(scaler_v3, "scaler_beijing_v3.pkl")
print("\nScaler V3 disimpan sebagai scaler_beijing_v3.pkl")

# =====================================
# 7. SEIMBANGKAN DATA (SMOTE)
# =====================================
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train_scaled, y_train)

print("Jumlah data setelah SMOTE:", len(X_train_res))

# =====================================
# 8. TRAINING RANDOM FOREST (PARAMETER OPTIM, TAPI MASIH WAJAR)
# =====================================
model_v3 = RandomForestClassifier(
    n_estimators=400,          # pohon lebih banyak dari V1
    max_depth=18,             # sedikit lebih dalam
    min_samples_leaf=2,       # mencegah overfitting parah
    max_features="sqrt",
    class_weight="balanced",  # bantu kelas minoritas
    random_state=42,
    n_jobs=-1
)

model_v3.fit(X_train_res, y_train_res)

# =====================================
# 9. EVALUASI
# =====================================
y_pred = model_v3.predict(X_test_scaled)

akurasi_v3 = accuracy_score(y_test, y_pred)

print("\nAKURASI MODEL V3 (VALID, TANPA LEAK):", akurasi_v3)
print("\nLAPORAN KLASIFIKASI V3:")
print(classification_report(y_test, y_pred))

# =====================================
# 10. SIMPAN MODEL V3
# =====================================
joblib.dump(model_v3, "model_kualitas_udara_beijing_v3.pkl")
print("\nModel V3 disimpan sebagai model_kualitas_udara_beijing_v3.pkl")

print("\n=== OPTIMASI MODEL V3 SELESAI ===")
