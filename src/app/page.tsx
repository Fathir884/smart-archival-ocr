"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileSpreadsheet, Loader2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { ExtractionResult } from "@/components/extraction-result";
import { performGeminiOCR } from "@/lib/ocr";

export default function Home() {
  const { data: session } = useSession();
  const [demoSession, setDemoSession] = useState<{ user: { name: string; email: string; image: string | null } } | null>(null);

  // Combine real session or demo session
  const activeSession = session || demoSession;

  const handleDemoLogin = () => {
    setDemoSession({ user: { name: "Guest User", email: "guest@local", image: null } });
  };

  const [url, setUrl] = useState("");
  const [manualColumnsInput, setManualColumnsInput] = useState("");
  const [sheetConnected, setSheetConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState<Record<string, string> | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);



  const handleConnect = async () => {
    if (!url) {
      alert("Mohon masukkan link spreadsheet.");
      return;
    }

    setIsConnecting(true);

    try {
      const res = await fetch("/api/sheet/headers", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setHeaders(data.headers);
        setSheetConnected(true);
      } else {
        alert("Gagal mengambil header: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungkan sheet");
    } finally {
      setIsConnecting(false);
    }
  };



  const [progress, setProgress] = useState(0);
  const [rawOCRText, setRawOCRText] = useState("");

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setRawOCRText("");

    try {
      // Use Gemini Vision API for direct structured extraction
      const extractedData = await performGeminiOCR(file, headers, (p) => setProgress(Math.round(p)));

      // Store raw JSON for debug purposes
      setRawOCRText(JSON.stringify(extractedData, null, 2));

      setScannedData(extractedData);
    } catch (error) {
      console.error(error);
      alert("Gagal memproses dokumen. Pastikan API Key Gemini sudah diisi di .env.local dan gambar jelas.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleSaveToSheet = async (data: Record<string, string>) => {
    try {
      const res = await fetch("/api/sheet/save", {
        method: "POST",
        body: JSON.stringify({ url, data }), // Send URL and Data
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();

      if (result.success) {
        alert("Data BERHASIL disimpan ke Google Sheet!");
        setScannedData(null);
        setRawOCRText("");
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  };



  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header / User Info */}
      {activeSession && (
        <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {activeSession.user?.image && <img src={activeSession.user.image} alt="User" className="w-6 h-6 rounded-full" />}
            <span className="text-sm font-medium text-white">{activeSession.user?.name}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-full glass hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl z-10 space-y-6 mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wider uppercase">
            MBKM Project • AI Powered
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Arsip Fisik ke <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
            Digital
          </span> dalam Sekejap.
        </h1>

        {!activeSession && (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Login untuk menghubungkan Spreadsheet dan mulai digitalisasi arsipmu.
          </p>
        )}
      </motion.div>

      {/* Main Action Area */}
      <AnimatePresence mode="wait">
        {!activeSession ? (
          /* LOGIN STATE */
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6"
          >
            <button
              onClick={() => signIn("google")}
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-3 overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {/* Google Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={handleDemoLogin}
                className="text-xs text-white/40 hover:text-white hover:underline transition-colors"
              >
                Lanjutkan sebagai Tamu (Simulasi tanpa akun)
              </button>
            </div>
          </motion.div>
        ) : !sheetConnected ? (
          /* CONNECT SHEET STATE */
          <motion.div
            key="connect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md glass-card rounded-2xl p-8 z-10"
          >
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                Link Google Sheet Tujuan
              </label>
              <div className="relative">
                <FileSpreadsheet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-secondary/50 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>


              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={cn(
                  "group w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
                  isConnecting && "opacity-80"
                )}
              >
                {isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Hubungkan</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : scannedData ? (
          /* REVIEW STATE */
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <ExtractionResult
              data={scannedData}
              onSave={handleSaveToSheet}
              onCancel={() => setScannedData(null)}
            />
            {rawOCRText && (
              <div className="glass p-4 rounded-xl">
                <details className="text-xs text-muted-foreground cursor-pointer">
                  <summary className="font-medium hover:text-white transition-colors mb-2 select-none">
                    Lihat Teks Asli (Debug OCR)
                  </summary>
                  <pre className="whitespace-pre-wrap bg-black/20 p-4 rounded-lg font-mono text-white/70 max-h-60 overflow-y-auto border border-white/5">
                    {rawOCRText}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ) : (
          /* SCAN/UPLOAD STATE */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full z-10 flex flex-col items-center"
          >
            {/* Headers Preview */}
            <div className="mb-6 w-full max-w-xl">
              <div className="glass px-4 py-3 rounded-xl flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Target Kolom</span>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">Active</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {headers.map((h, i) => (
                  <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/80">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {isProcessing ? (
              <div className="w-full h-64 glass-card rounded-2xl flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <p className="text-lg font-medium text-white animate-pulse">Sedang Membaca Dokumen... {progress}%</p>
                <p className="text-sm text-muted-foreground">AI sedang menganalisis konteks...</p>
                {/* Progress Bar */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <FileUpload onFileSelect={handleFileSelect} />
            )}

            {!isProcessing && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setSheetConnected(false)}
                  className="text-sm text-muted-foreground hover:text-white underline underline-offset-4"
                >
                  Ganti Spreadsheet
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full z-10"
      >
        {!session && [
          { title: "Bebas Format", desc: "Ikuti struktur tabelmu, bukan sebaliknya." },
          { title: "Paham Konteks", desc: "AI mengerti mana 'Nama' dan 'Alamat' secara otomatis." },
          { title: "Sekali Klik", desc: "Foto dokumen, dan data langsung tersimpan." },
        ].map((feature, i) => (
          <div key={i} className="glass p-6 rounded-xl hover:bg-white/5 transition-colors cursor-default border-transparent hover:border-white/10">
            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
