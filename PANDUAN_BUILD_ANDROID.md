# 📱 Panduan Lengkap: Build Android APK

## 🎯 **Prerequisites (Yang Harus Di-install Dulu)**

### 1. **Android Studio**
- Download: https://developer.android.com/studio
- Install dengan default settings
- Setelah install, buka Android Studio:
  - **Tools** → **SDK Manager**
  - Install **Android SDK Platform 24** (Android 7.0)
  - Install **Android SDK Build-Tools**

### 2. **Java JDK 17**
- Download: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Install dan set `JAVA_HOME` environment variable

### 3. **Node.js** (Sudah ada)
- Cek versi: `node -v` (harus 18+)

---

## 🚀 **Cara Build APK (Step-by-Step)**

### **Step 1: Pastikan Konfigurasi Benar**
Saya sudah setting `capacitor.config.ts` kamu untuk mengarah ke:  
`https://smart-archival-ocr-y5x2.vercel.app/`

Ini artinya:
- Kamu **TIDAK PERLU** `npm run build` setiap kali update kode.
- Cukup push ke GitHub -> Vercel update -> **Aplikasi di HP otomatis update!** (Magic! ✨)

### **Step 2: Buka Android Studio**
Jalankan perintah ini di terminal VS Code:
```bash
npx cap open android
```
Atau buka manual Android Studio dan arahkan ke folder `android` di dalam project ini.

### **Step 3: Build APK**
1. Di Android Studio, tunggu proses **Gradle Sync** selesai (lihat loading bar di bawah).
2. Klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Tunggu sampai muncul notifikasi "Build APK(s): APK(s) generated successfully".
4. Klik **locate** pada notifikasi tersebut.
5. File `app-debug.apk` siap dipindahkan ke HP kamu!

*(Lokasi file: `android/app/build/outputs/apk/debug/app-debug.apk`)*

#### **Opsi B: Release APK (Production, perlu signing)**
1. **Generate Signing Key** (sekali saja):
   ```bash
   cd android
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
   - Isi password & info yang diminta
   - File `my-release-key.keystore` akan dibuat

2. **Setup Signing Config**:
   - Buka file `android/app/build.gradle`
   - Cari line `android {`
   - Tambahkan config ini (sebelum `buildTypes`):
   ```gradle
   signingConfigs {
       release {
           storeFile file('my-release-key.keystore')
           storePassword 'your_password_here'
           keyAlias 'my-key-alias'
           keyPassword 'your_password_here'
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           ...
       }
   }
   ```

3. **Build Release APK**:
   - Klik **Build** → **Generate Signed Bundle / APK**
   - Pilih **APK**
   - **Next** → Pilih keystore → Masukkan password
   - Pilih **release** build variant
   - **Finish**
   - APK tersimpan di:
     ```
     android/app/build/outputs/apk/release/app-release.apk
     ```

---

## 📤 **Install APK ke HP Android**

### **Cara 1: Via USB Debugging**
1. **Enable Developer Options di HP**:
   - **Settings** → **About Phone** 
   - Tap **Build Number** 7 kali
   - Kembali ke Settings
   - **System** → **Developer Options**
   - Aktifkan **USB Debugging**

2. **Connect HP ke Komputer**:
   - Colok HP pakai kabel USB
   - Pilih **File Transfer** mode
   - Accept "Allow USB Debugging" di HP

3. **Install via Command**:
   ```bash
   # Install debug APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   
   # Atau langsung run
   npm run android:run
   ```

### **Cara 2: Transfer Manual (Mudah!)**
1. Copy file APK ke HP (via Bluetooth, USB, atau Google Drive)
2. Buka File Manager di HP
3. Tap file APK
4. Tap **Install**
5. Jika ada warning "Unknown Sources":
   - **Settings** → **Security**
   - Aktifkan **"Install from unknown sources"**
6. Kembali dan install APK

### **Cara 3: Share via Google Drive/WhatsApp**
1. Upload APK ke Google Drive or kirim via WhatsApp
2. Download di HP
3. Install seperti Cara 2

---

## 🔧 **Troubleshooting Build Errors**

### **Error: "JAVA_HOME not set"**
**Fix**:
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%PATH%;%JAVA_HOME%\bin

# Mac/Linux
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

### **Error: "SDK location not found"**
**Fix**:
- Buat file `android/local.properties`
- Isi dengan:
  ```
  sdk.dir=C\:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
  ```
  (Ganti path sesuai lokasi Android SDK kamu)

### **Error: "Gradle build failed"**
**Fix**:
```bash
cd android
./gradlew clean
cd ..
npm run android:build
```

### **APK size terlalu besar (>100MB)**
**Fix**:
- Hapus unused dependencies
- Enable ProGuard minification di `android/app/build.gradle`:
  ```gradle
  buildTypes {
      release {
          minifyEnabled true
          shrinkResources true
          ...
      }
  }
  ```

---

## 📊 **File Size Optimization**

APK default bisa ~50-80MB. Untuk optimize:

1. **Enable Minification** (sudah dijelaskan di atas)
2. **Split APK by ABI**:
   ```gradle
   splits {
       abi {
           enable true
           reset()
           include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
           universalApk true
       }
   }
   ```
3. **Use WebP** instead of PNG untuk gambar
4. **Remove unused fonts & icons**

---

## 🎓 **Untuk Laporan MBKM**

Screenshot yang bagus untuk laporan:
1. 📸 **Build Success** di Android Studio
2. 📸 **APK File** di folder output
3. 📸 **App Running** di HP Android
4. 📸 **Scan Result** yang berhasil

---

## ✅ **Checklist Sebelum Share APK**

- [ ] Test install di minimal 2 HP berbeda
- [ ] Test semua fitur (Login, Scan, Save)
- [ ] Cek permission Camera working
- [ ] File size < 100MB (kalau bisa)
- [ ] Icon app sudah custom (bukan default Capacitor)
- [ ] Splash screen sudah custom

---

**Good luck!** 🚀
