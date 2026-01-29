# 🔑 Cara Setup Gemini Vision API

## 1️⃣ Dapatkan API Key

1. Buka: **https://aistudio.google.com/apikey**
2. Klik **"Create API Key"**
3. Pilih project Google Cloud (atau buat baru)
4. Copy API Key yang muncul (format: `AIza...`)

⚠️ **Jangan share API Key ke publik!**

---

## 2️⃣ Masukkan ke Project

1. Buka file **`.env.local`** di root project (jika belum ada, buat file baru)
2. Tambahkan baris berikut:

```env
GEMINI_API_KEY=AIza_your_actual_api_key_here
```

3. Ganti `AIza_your_actual_api_key_here` dengan API Key yang kamu dapat

**Contoh isi lengkap `.env.local`:**
```env
# Google OAuth (untuk login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Gemini AI Vision API
GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
```

---

## 3️⃣ Restart Server

1. Stop server Next.js (Ctrl+C di terminal)
2. Jalankan ulang: `npm run dev`
3. Buka `http://localhost:3000`

---

## 4️⃣ Test Scanning

1. Upload sertifikat BNSP yang tadi
2. Hasil seharusnya **100% akurat** sekarang! 🎯

---

## 📊 Quota Gratis Gemini

- **Gratis**: 1,500 request/hari
- **Rate limit**: 15 request/menit

Untuk project ini sudah **lebih dari cukup**! 🚀

---

## ❓ Troubleshooting

### Error: "API Key Invalid"
- Pastikan API Key sudah benar di `.env.local`
- Pastikan sudah restart server

### Error: "Quota Exceeded"
- Tunggu sampai besok (quota reset setiap hari)
- Atau upgrade ke paid plan jika butuh lebih banyak

### Hasil Masih Salah
- Pastikan gambar sertifikat:
  - ✅ Jelas (tidak blur)
  - ✅ Pencahayaan baik
  - ✅ Format: JPG/PNG
  - ✅ Resolusi minimal 800x600px
