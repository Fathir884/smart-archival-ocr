# 🖥️ Smart Archival OCR - Desktop Application

Aplikasi desktop untuk digitalisasi arsip fisik menggunakan AI Vision (Gemini 2.5 Flash).

## 📦 Download & Install

### Windows
1. Download file `Smart-Archival-OCR-Setup-1.0.0.exe`
2. Double-click untuk install
3. Ikuti wizard instalasi
4. Jalankan aplikasi dari Desktop atau Start Menu

### Mac
1. Download file `Smart-Archival-OCR-1.0.0.dmg`
2. Buka file DMG
3. Drag aplikasi ke folder Applications
4. Jalankan dari Launchpad

### Linux
1. Download file `Smart-Archival-OCR-1.0.0.AppImage`
2. Buat file executable: `chmod +x Smart-Archival-OCR-1.0.0.AppImage`
3. Jalankan: `./Smart-Archival-OCR-1.0.0.AppImage`

---

## 🚀 Cara Pakai

1. **Login dengan Google**
   - Klik "Masuk dengan Google"
   - Pilih akun Google Anda
   
2. **Setup Google Sheet**
   - Paste link Google Sheets
   - Klik "Hubungkan"
   - Kolom akan ter-load otomatis

3. **Scan Dokumen**
   - Klik "Pilih file" atau drag & drop gambar sertifikat
   - Format: JPG, PNG, PDF
   - Tunggu proses OCR selesai

4. **Simpan ke Google Sheets**
   - Review hasil scan
   - Klik "Simpan ke Sheets"
   - Data otomatis masuk ke spreadsheet!

---

## ⚙️ Setup Environment Variables

Sebelum build, pastikan sudah setup `.env.local`:

```env
# Gemini AI Vision API
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

---

## 🛠️ Development

### Run Desktop App (Dev Mode)
```bash
npm run electron:dev
```

### Build Desktop App
```bash
# Build untuk platform saat ini
npm run dist

# Build Windows installer (.exe)
npm run electron:build -- --win

# Build Mac app (.dmg)
npm run electron:build -- --mac

# Build Linux app (.AppImage)
npm run electron:build -- --linux
```

### Output
File installer akan tersimpan di folder `dist/`:
- **Windows**: `Smart-Archival-OCR-Setup-1.0.0.exe`
- **Mac**: `Smart-Archival-OCR-1.0.0.dmg`
- **Linux**: `Smart-Archival-OCR-1.0.0.AppImage`

---

## 📋 System Requirements

- **Windows**: Windows 10/11 (64-bit)
- **Mac**: macOS 10.13 or later
- **Linux**: Ubuntu 18.04+, Fedora 32+, or equivalent
- **RAM**: Minimum 4GB
- **Storage**: 500MB free space
- **Internet**: Required untuk login & save to Sheets

---

## 🎓 MBKM Project

Developed as part of MBKM (Merdeka Belajar Kampus Merdeka) program.

**Technologies:**
- Next.js 16 + React 19
- Electron 40
- Gemini 2.5 Flash AI
- Google OAuth & Sheets API
- Tailwind CSS 4

---

## 📝 License

Proprietary - MBKM Team © 2026
