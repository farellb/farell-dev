"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadSimple, X, Spinner } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);

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
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-200 group">
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <label className={cn(
                    "cursor-pointer flex flex-col items-center justify-center w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors",
                    loading && "opacity-50 cursor-not-allowed"
                )}>
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Spinner className="animate-spin" size={24} />
                            <span className="text-sm text-gray-500">Yüklənir...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <UploadSimple size={24} />
                            <span className="text-sm font-medium">Şəkil Seç</span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onUpload}
                        disabled={loading}
                    />
                </label>
            </div>
        </div>
    );
}
