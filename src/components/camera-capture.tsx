"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, RefreshCw, ScanLine, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            setIsScanning(true);
        }
    }, [webcamRef]);

    useEffect(() => {
        if (isScanning) {
            const timer = setTimeout(() => {
                setIsScanning(false);
            }, 2000); // 2 seconds scanning animation
            return () => clearTimeout(timer);
        }
    }, [isScanning]);

    const retake = () => {
        setImgSrc(null);
        setIsScanning(false);
    };

    const confirm = async () => {
        if (imgSrc) {
            try {
                const res = await fetch(imgSrc);
                const blob = await res.blob();
                const file = new File([blob], "smart-scan-" + Date.now() + ".jpg", { type: "image/jpeg" });
                onCapture(file);
            } catch (e) {
                console.error("Error converting image to file", e);
            }
        }
    };

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onClose} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-white font-semibold tracking-wide">Smart Scan</span>
                    <AnimatePresence mode="wait">
                        {isScanning ? (
                            <motion.span
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                key="scanning" className="text-[10px] text-accent uppercase tracking-widest font-bold"
                            >
                                Mendeteksi Tepi...
                            </motion.span>
                        ) : imgSrc ? (
                            <motion.span
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                key="result" className="text-[10px] text-green-400 uppercase tracking-widest font-bold"
                            >
                                Crop Otomatis Selesai
                            </motion.span>
                        ) : (
                            <motion.span
                                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                key="camera" className="text-[10px] text-white/50 uppercase tracking-widest font-bold"
                            >
                                AI Auto-Enhance
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                {!imgSrc && (
                    <button onClick={toggleCamera} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10">
                        <RefreshCw className="w-6 h-6" />
                    </button>
                )}
                {imgSrc && (
                    <div className="w-10" /> /* Spacer */
                )}
            </div>

            <div className="relative w-full h-full flex-1 bg-black flex items-center justify-center overflow-hidden">
                {imgSrc ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={false}
                            animate={isScanning ? { scale: 1.05 } : { scale: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="relative w-full h-full"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgSrc} alt="captured" className="w-full h-full object-contain" />

                            {/* Scanning Overlay Effect */}
                            <AnimatePresence>
                                {isScanning && (
                                    <>
                                        {/* Scanning Grid */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 pointer-events-none"
                                        >
                                            <div className="w-full h-full border-[2px] border-accent/50 absolute inset-0 m-8 rounded-lg animate-pulse shadow-[0_0_50px_rgba(34,211,238,0.2)]" />
                                            {/* Moving Scan Line */}
                                            <div className="absolute top-0 left-8 right-8 h-0.5 bg-accent shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan-fast" />

                                            {/* Corner Reticles */}
                                            <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-accent" />
                                            <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-accent" />
                                            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-accent" />
                                            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-accent" />
                                        </motion.div>

                                        {/* Processing Text */}
                                        <div className="absolute inset-0 flex items-center justify-center z-30">
                                            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                                <ScanLine className="w-5 h-5 text-accent animate-pulse" />
                                                <span className="text-white font-medium">Meratakan Dokumen...</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Result Actions - Only show when NOT scanning */}
                        {!isScanning && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute inset-x-0 bottom-0 p-6 z-30 bg-gradient-to-t from-black via-black/90 to-transparent"
                            >
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={retake}
                                        className="w-full py-4 rounded-xl bg-white/10 backdrop-blur text-white font-medium hover:bg-white/20 transition-colors border border-white/5"
                                    >
                                        Ulangi
                                    </button>
                                    <button
                                        onClick={confirm}
                                        className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <Check className="w-5 h-5" />
                                        Gunakan
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    /* Camera Live View */
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                facingMode: facingMode,
                                width: { ideal: 1920 },
                                height: { ideal: 1080 }
                            }}
                            className="w-full h-full object-cover"
                        />

                        {/* Camera Overlay Guide */}
                        <div className="absolute inset-0 pointer-events-none m-6 md:m-12 border border-white/20 rounded-2xl">
                            {/* Corners */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white/80 rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white/80 rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white/80 rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white/80 rounded-br-xl" />

                            {/* Grid Lines Hint */}
                            <div className="absolute top-1/3 inset-x-0 h-px bg-white/10" />
                            <div className="absolute top-2/3 inset-x-0 h-px bg-white/10" />
                            <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
                            <div className="absolute inset-y-0 right-1/3 w-px bg-white/10" />
                        </div>

                        {/* Shutter Button */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
                            <button
                                onClick={capture}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-white/30 rounded-full scale-110 blur-md group-hover:bg-primary/50 transition-colors" />
                                <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent group-active:scale-95 transition-transform relative z-10">
                                    <div className="w-16 h-16 bg-white rounded-full group-hover:bg-primary transition-colors" />
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx global>{`
        @keyframes scan-fast {
          0% { top: 2rem; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 2rem); opacity: 0; }
        }
        .animate-scan-fast {
          animation: scan-fast 1.5s linear infinite;
        }
      `}</style>
        </motion.div>
    );
}
