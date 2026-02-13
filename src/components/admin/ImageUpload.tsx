"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadSimple, X, Spinner } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    maxImages?: number;
}

export default function ImageUpload({ value, onChange, onRemove, maxImages = 4 }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const canUpload = value.length < maxImages;

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            onChange([...value, data.url]);
        } catch (error) {
            console.error(error);
            alert("Şəkil yüklənərkən xəta baş verdi.");
        } finally {
            setLoading(false);
            e.target.value = '';
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {value.map((url, idx) => (
                    <div key={url} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
                            >
                                <X size={12} weight="bold" />
                            </button>
                        </div>
                        {idx === 0 && (
                            <span className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                Əsas
                            </span>
                        )}
                        <Image
                            fill
                            className="object-cover"
                            alt={`Şəkil ${idx + 1}`}
                            src={url}
                        />
                    </div>
                ))}
                {canUpload && (
                    <label className={cn(
                        "cursor-pointer flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all",
                        loading && "opacity-50 cursor-not-allowed"
                    )}>
                        {loading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Spinner className="animate-spin text-gray-400" size={20} />
                                <span className="text-[11px] text-gray-400">Yüklənir...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                <UploadSimple size={20} />
                                <span className="text-[11px] font-medium">Şəkil Əlavə Et</span>
                                <span className="text-[10px] text-gray-300">{value.length}/{maxImages}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onUpload}
                            disabled={loading || !canUpload}
                        />
                    </label>
                )}
            </div>
            {value.length === 0 && !canUpload && null}
        </div>
    );
}
