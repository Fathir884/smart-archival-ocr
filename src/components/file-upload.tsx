"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    disabled?: boolean;
}

import { CameraCapture } from "@/components/camera-capture";

export function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
    const [fileCount, setFileCount] = useState(0);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            handleFiles(acceptedFiles);
        }
    }, [onFileSelect]);

    const handleFiles = (selectedFiles: File[]) => {
        setFileCount(selectedFiles.length);
        onFileSelect(selectedFiles);
        setIsCameraOpen(false);
    };

    const handleCameraCapture = (file: File) => {
        handleFiles([file]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 10,
        multiple: true,
        disabled
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key="dropzone"
                >
                    <div
                        {...getRootProps()}
                        className={cn(
                            "relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-out p-6",
                            disabled ? "opacity-50 cursor-not-allowed border-white/10 bg-white/5" : "cursor-pointer",
                            isDragActive && !disabled
                                ? "border-accent bg-accent/5 scale-[1.02]"
                                : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                        )}
                    >
                        <input {...getInputProps()} />

                        <div className="rounded-full bg-white/10 p-4 mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                            <Upload className="w-8 h-8 text-white/70 group-hover:text-white" />
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
                                {isDragActive ? "Lepaskan file di sini" : "Upload Dokumen & PDF"}
                            </h3>
                            <p className="text-sm text-muted-foreground px-4">
                                Drag & drop atau klik untuk memilih file (Gambar atau PDF)
                            </p>
                        </div>

                        {/* Decorative corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg group-hover:border-accent/50 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg group-hover:border-accent/50 transition-colors" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {!disabled && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setIsCameraOpen(true)}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/20"
                    >
                        <Camera className="w-4 h-4" />
                        <span>Scan Dokumen (PDF & Image)</span>
                    </button>
                </div>
            )}

            <AnimatePresence>
                {isCameraOpen && (
                    <CameraCapture
                        onCapture={handleCameraCapture}
                        onClose={() => setIsCameraOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
