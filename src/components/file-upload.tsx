"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.[0]) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            onFileSelect(selectedFile);
        }
    }, [onFileSelect]);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key="dropzone"
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-out p-6",
                                isDragActive
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
                                    {isDragActive ? "Lepaskan file di sini" : "Upload Dokumen Arsip"}
                                </h3>
                                <p className="text-sm text-muted-foreground px-4">
                                    Drag & drop atau klik untuk memilih file gambar (JPG, PNG)
                                </p>
                            </div>

                            {/* Decorative corner accents */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-lg group-hover:border-accent/50 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 rounded-br-lg group-hover:border-accent/50 transition-colors" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key="preview"
                        className="relative rounded-2xl overflow-hidden glass-card border border-primary/20 p-4"
                    >
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={preview!}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={removeFile}
                                className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur hover:bg-destructive/80 transition-colors text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <FileImage className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md border border-green-500/30">
                                Ready
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
