"use client";

import { motion } from "framer-motion";
import { Check, Edit2, Save, X, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface BatchExtractionResultProps {
    data: Record<string, string>[];
    headers: string[];
    onSave: (data: Record<string, string>[]) => void;
    onCancel: () => void;
}

export function BatchExtractionResult({ data: initialData, headers, onSave, onCancel }: BatchExtractionResultProps) {
    const [data, setData] = useState(initialData);
    const [activeRow, setActiveRow] = useState<number | null>(null);

    const handleChange = (index: number, key: string, value: string) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        setData(newData);
    };

    const handleDelete = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        if (newData.length === 0) {
            onCancel(); // Exit if no data left
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl flex flex-col gap-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full mr-2" />
                    Hasil Ekstraksi Batch ({data.length} Dokumen)
                </h3>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors">
                        Batal
                    </button>
                    <button onClick={() => onSave(data)} className="px-6 py-2 rounded-lg bg-green-500 text-black font-bold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Simpan Semua
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/70 uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-4 w-12 text-center">#</th>
                                {headers.map((h) => (
                                    <th key={h} className="p-4 min-w-[150px]">{h}</th>
                                ))}
                                <th className="p-4 w-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-center text-muted-foreground">{i + 1}</td>
                                    {headers.map((h) => (
                                        <td key={h} className="p-2 relative">
                                            <input
                                                type="text"
                                                value={row[h] || ""}
                                                onChange={(e) => handleChange(i, h, e.target.value)}
                                                className="w-full bg-transparent p-2 rounded hover:bg-white/5 focus:bg-white/10 focus:outline-none text-white transition-colors h-full"
                                            />
                                            {/* Corner indicator if field is empty */}
                                            {!row[h] && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500/50 rounded-full" title="Empty field" />}
                                        </td>
                                    ))}
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(i)}
                                            className="p-2 text-white/30 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Hapus baris ini"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-center text-muted-foreground text-sm">
                *Klik pada teks untuk mengedit sebelum menyimpan.
            </p>
        </motion.div>
    );
}
