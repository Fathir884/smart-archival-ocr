# 📱 Smart Archival OCR - Android App

Aplikasi Android untuk digitalisasi arsip fisik menggunakan AI Vision (Gemini 2.5 Flash).

---

## 📦 Download & Install APK

### Cara Install (Untuk User)
1. Download file `smart-archival-ocr.apk`
2. Buka file APK di HP Android
3. Jika muncul peringatan "Install dari sumber tidak dikenal":
   - Buka **Settings** → **Security**
   - Aktifkan **"Unknown Sources"** atau **"Install from unknown sources"**
4. Install aplikasi
5. Buka dari home screen

---

## 🚀 Cara Pakai Aplikasi

### 1. Login dengan Google
- Tap "Masuk dengan Google"
- Pilih akun Google Anda

### 2. Setup Google Sheet
- Paste link Google Sheets
- Tap "Hubungkan"
- Kolom akan ter-load otomatis

### 3. Scan Dokumen
**Opsi 1: Ambil Foto**
- Tap tombol kamera 📷
- Foto sertifikat langsung dari kamera
- Pastikan pencahayaan bagus & tidak blur

**Opsi 2: Pilih dari Galeri**
- Tap "Pilih file"
- Pilih gambar dari galeri
- Format: JPG, PNG

### 4. Simpan ke Google Sheets
- Review hasil scan
- Tap "Simpan ke Sheets"
- Data otomatis masuk ke spreadsheet! ✅

---

## 🛠️ Development (Untuk Developer)

### Requirements
1. ✅ **Node.js** 18+ & npm
2. ✅ **Android Studio** (untuk build APK)
3. ✅ **Java JDK** 17+

### Setup Environment
```bash
# Install dependencies
npm install

# Setup API Keys di .env.local
GEMINI_API_KEY=your_api_key_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

### Build & Run

#### 1. Build Web App
```bash
npm run build
```

#### 2. Sync ke Android
```bash
npm run android:sync
```

#### 3. Buka Android Studio
```bash
npm run android:open
```

#### 4. Build APK di Android Studio
- Di Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- APK akan tersimpan di: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 5. Install ke HP (via USB Debugging)
```bash
# Enable USB Debugging di HP:
# Settings → About Phone → Tap "Build Number" 7x → Developer Options → USB Debugging

# Run di HP langsung
npm run android:run
```

---

## 📋 System Requirements

### Untuk User (Install APK)
- **Android**: Version 7.0 (Nougat) or later
- **RAM**: Minimum 2GB
- **Storage**: 100MB free space
- **Internet**: Required untuk login & save to Sheets
- **Permissions**:
  - 📷 Camera (untuk scan langsung)
  - 📁 Storage (untuk pilih file dari galeri)
  - 🌐 Internet

### Untuk Developer (Build APK)
- **Android Studio**: Flamingo (2022.2.1) or later
- **Android SDK**: API Level 24+ (Android 7.0+)
- **Gradle**: 8.0+
- **Java JDK**: 17+

---

## 🎓 MBKM Project

Developed as part of MBKM (Merdeka Belajar Kampus Merdeka) program.

**Technologies:**
- Next.js 16 + React 19
- Capacitor 8 (Web → Native Android)
- Gemini 2.5 Flash AI
- Google OAuth & Sheets API
- Tailwind CSS 4
- Native Camera API

---

## 🔧 Troubleshooting

### APK tidak bisa di-install
- Pastikan "Unknown Sources" sudah diaktifkan
- Hapus versi lama kalau ada
- Download ulang APK (mungkin corrupt)

### Kamera tidak berfungsi
- Beri permission Camera di Settings HP
- Restart aplikasi

### Login gagal
- Pastikan HP konek internet
- Cek API Key di developer console

### Hasil scan tidak akurat
- Pastikan foto jelas & tidak blur
- Pencahayaan harus bagus
- Tidak ada bayangan di sertifikat

---

## 📝 License

Proprietary - MBKM Team © 2026
