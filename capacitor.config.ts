import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fathir.smartocr',
  appName: 'Smart Archival OCR',
  webDir: 'out',
  server: {
    // Ganti URL ini dengan link Vercel kamu!
    url: 'https://smart-archival-ocr-y5x2.vercel.app',
    cleartext: true
  }
};

export default config;
