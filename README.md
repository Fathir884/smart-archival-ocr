# Smart Archival OCR - MBKM Project Prototype

Aplikasi ini adalah prototype untuk sistem digitalisasi arsip fisik ke Google Spreadsheet menggunakan AI.

## Fitur Utama (Prototype)
1.  **Context-Aware**: Mendeteksi kolom dari Spreadsheet secara dinamis.
2.  **Flexible Upload**: Drag & Drop dokumen fisik.
3.  **Mock AI Processing**: Simulasi ekstraksi data cerdas (karena belum ada API Key Gemini asli).
4.  **Integration**: Simulasi koneksi ke Google Spreadsheet.

## Cara Menjalankan

1.  Pastikan Node.js sudah terinstall.
2.  Buka terminal di folder ini.
3.  Install dependencies (jika belum):
    ```bash
    npm install
    ```
4.  Jalankan server development:
    ```bash
    npm run dev
    ```
5.  Buka `http://localhost:3000` di browser.

## Panduan Demo
1.  Di halaman login, klik **"Masuk sebagai Demo / Tamu"** (teks kecil di bawah tombol Google).
2.  Di kolom Link Spreadsheet, masukkan link bebas (contoh: `https://docs.google.com/XXX`).
3.  Klik **Hubungkan**. Sistem akan mensimulasikan pengambilan header kolom.
4.  Upload gambar sample.
5.  Sistem akan "berpikir" (simulasi AI) dan menampilkan hasil ekstraksi.
6.  Anda bisa mengedit hasil sebelum klik **Simpan**.

## Catatan Teknis
-   File konfigurasi mock ada di `.env.local`.
-   Logika simulasi AI ada di `src/app/api/process-document/route.ts`.
-   Untuk mengubah menjadi aplikasi nyata, Anda perlu memasukkan API Key Google Gemini dan setup OAuth Google Cloud Platform yang sesungguhnya.
