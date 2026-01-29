# Panduan Mengaktifkan Login Google

Agar tombol "Masuk dengan Google" berfungsi, Anda perlu mendaftarkan aplikasi ini ke Google. Gratis dan hanya butuh 5 menit.

## 1. Buka Google Cloud Console
Kunjungi: [https://console.cloud.google.com/](https://console.cloud.google.com/)
1.  Login dengan akun Google Anda.
2.  Klik dropdown project di kiri atas, lalu **"New Project"**.
3.  Beri nama project (misal: `Smart-Arsip-MBKM`) -> Klik **Create**.

## 2. Setup Layar Persetujuan (OAuth Consent Screen)
1.  Di menu kiri, cari & klik **"APIs & Services"** > **"OAuth consent screen"**.
2.  Pilih **External** -> Klik **Create**.
3.  Isi data wajib saja:
    *   **App Name**: Smart Archival OCR
    *   **User Support Email**: Pilih email Anda.
    *   **Developer Contact Email**: Isi email Anda.
4.  Klik **Save and Continue** sampai selesai (bagian Scope & Test Users bisa dilewati/Next saja).

## 3. Buat Kunci (Credentials)
1.  Di menu kiri, klik **"Credentials"**.
2.  Klik **"+ CREATE CREDENTIALS"** (di atas) -> Pilih **"OAuth client ID"**.
3.  **Application Type**: Pilih **Web application**.
4.  **Name**: Biarkan default atau ganti nama.
5.  **Authorized JavaScript origins** (PENTING):
    *   Klik **ADD URI** -> Masukkan: `http://localhost:3000`
6.  **Authorized redirect URIs** (PENTING):
    *   Klik **ADD URI** -> Masukkan: `http://localhost:3000/api/auth/callback/google`
7.  Klik **CREATE**.

## 4. Salin Kunci Anda
Google akan menampilkan popup dengan **Your Client ID** dan **Your Client Secret**.
1.  Salin kedua kode tersebut.
2.  Buka file `.env.local` di folder proyek ini.
3.  Ganti `mock_client_id` dan `mock_client_secret` dengan kode asli Anda.

Contoh `.env.local` yang valid:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rahasia_acak_bebas_ketik_apa_aja
GOOGLE_CLIENT_ID=123456789-abcdefghijklmn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefg1234567
```

## 5. Restart Aplikasi
Setelah file `.env.local` diupdate, matikan terminal (Ctrl+C) dan jalankan lagi `npm run dev`.
Tombol Login Google sekarang akan berfungsi!
