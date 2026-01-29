"use client";

import { motion } from "framer-motion";
import { Check, Edit2, Save, X } from "lucide-react";
import { useState } from "react";

interface ExtractionResultProps {
    data: Record<string, string>;
    onSave: (data: Record<string, string>) => void;
    onCancel: () => void;
}

export function ExtractionResult({ data: initialData, onSave, onCancel }: ExtractionResultProps) {
    const [data, setData] = useState(initialData);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const handleChange = (key: string, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl glass-card rounded-2xl p-6 md:p-8"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-2" />
                    Hasil Ekstraksi AI
                </h3>
                <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Silakan periksa sebelum disimpan
                </span>
            </div>

            <div className="grid gap-4 mb-8">
                {Object.entries(data).map(([key, value], index) => (
                    <div
                        key={key}
                        className="group relative bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                        <label className="text-xs font-medium text-accent uppercase tracking-wider mb-1 block">
                            {key}
                        </label>

                        <div className="flex items-start gap-2">
                            <textarea
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                                rows={1}
                                className="w-full bg-transparent text-white/90 text-base focus:outline-none resize-none field-sizing-content"
                                style={{ fieldSizing: "content" } as React.CSSProperties} // Modern CSS capability for auto-growing textarea
                            />
                            <Edit2 className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={() => onSave(data)}
                    className="flex-[2] py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                    <Save className="w-5 h-5" />
                    <span>Simpan ke Spreadsheet</span>
                </button>
            </div>
        </motion.div>
    );
}
