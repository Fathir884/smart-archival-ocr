"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/file-upload";
import { ExtractionResult } from "@/components/extraction-result";
import { performGeminiOCR } from "@/lib/ocr";
import { Loader2, Sparkles } from "lucide-react";

export default function TestOCR() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [scannedData, setScannedData] = useState<Record<string, string> | null>(null);
    const [progress, setProgress] = useState(0);

    // Default headers untuk test
    const headers = ["NO", "NAMA", "NO REG", "BIDANG", "KUALIFIKASI", "TEMPAT, TANGGAL, BULAN, TAHUN"];

    const handleFileSelect = async (file: File) => {
        setIsProcessing(true);
        setProgress(0);
        setScannedData(null);

        try {
            const extractedData = await performGeminiOCR(file, headers, (p) => setProgress(Math.round(p)));
            setScannedData(extractedData);
        } catch (error) {
            console.error(error);
            alert("Gagal memproses dokumen. Pastikan API Key Gemini sudah diisi di .env.local dan gambar jelas.");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Smart Archival OCR</h1>
                            <p className="text-xs text-white/50">Test Mode - Gemini Vision</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <span className="text-sm text-purple-400">✨ Powered by Gemini 2.5 Flash</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Test OCR Sertifikat
                    </h2>
                    <p className="text-white/60">
                        Upload sertifikat BNSP atau dokumen lain untuk test ekstraksi data dengan AI
                    </p>
                </div>

                {/* Upload Section */}
                {!scannedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />

                        {isProcessing && (
                            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-4 mb-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                    <span className="text-sm text-white/70">Memproses dengan Gemini Vision...</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <p className="text-center text-sm text-white/50 mt-2">{progress}%</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Results */}
                {scannedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ExtractionResult
                            data={scannedData}
                            onSave={() => alert("Simpan ke Sheets tidak tersedia di test mode. Gunakan halaman utama (/) dengan login Google.")}
                            onCancel={() => setScannedData(null)}
                        />
                    </motion.div>
                )}

                {/* Info */}
                <div className="mt-12 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                    <h3 className="font-semibold mb-3 text-purple-300">ℹ️ Test Mode</h3>
                    <ul className="text-sm text-white/60 space-y-2">
                        <li>✅ OCR dengan Gemini Vision <strong>AKTIF</strong></li>
                        <li>❌ Login Google & Save to Sheets <strong>TIDAK AKTIF</strong></li>
                        <li>💡 Untuk fitur lengkap, fix Google OAuth di halaman utama <code className="text-purple-400">/</code></li>
                    </ul>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="inline-block px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                        ← Kembali ke Halaman Utama
                    </a>
                </div>
            </div>
        </div>
    );
}
