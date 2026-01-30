"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, RefreshCw, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const confirm = async () => {
        if (imgSrc) {
            try {
                const res = await fetch(imgSrc);
                const blob = await res.blob();
                const file = new File([blob], "camera-capture-" + Date.now() + ".jpg", { type: "image/jpeg" });
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
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-white font-semibold">Smart Scan</span>
                    <span className="text-xs text-green-400">AI Auto-Enhance Active</span>
                </div>
                <button onClick={toggleCamera} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <RefreshCw className="w-6 h-6" />
                </button>
            </div>

            <div className="relative w-full h-full max-w-md flex items-center justify-center overflow-hidden rounded-2xl bg-black">
                {imgSrc ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgSrc} alt="captured" className="w-full h-full object-contain" />

                        {/* Filter Overlay simulation */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-between items-center gap-4">
                            <button
                                onClick={retake}
                                className="flex-1 py-3 px-6 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20"
                            >
                                Ulangi
                            </button>
                            <button
                                onClick={confirm}
                                className="flex-1 py-3 px-6 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Gunakan
                            </button>
                        </div>
                    </div>
                ) : (
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
                        <div className="absolute inset-0 pointer-events-none border-[3px] border-white/20 m-8 rounded-lg flex flex-col justify-between p-4">
                            <div className="w-full flex justify-between">
                                <div className="w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                                <div className="w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                            </div>
                            <div className="w-full flex justify-between">
                                <div className="w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                                <div className="w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                            </div>
                            {/* Center scan line animation */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan-line top-1/2" />
                        </div>

                        {/* Shutter Button */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
                            <button
                                onClick={capture}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
                            >
                                <div className="w-16 h-16 bg-white rounded-full group-hover:bg-primary transition-colors" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx global>{`
        @keyframes scan-line {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
      `}</style>
        </motion.div>
    );
}
