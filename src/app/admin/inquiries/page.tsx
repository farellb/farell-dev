"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { WhatsappLogo, Clock, TShirt, Eye, Funnel, MagnifyingGlass, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Inquiry {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string | null;
    created_at: string;
}

export default function InquiriesPage() {
    const [inquiries] = useState<Inquiry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading] = useState(false);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Sorğular</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">WhatsApp vasitəsilə göndərilən məhsul sorğuları</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <WhatsappLogo size={20} weight="fill" className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Ümumi Sorğu</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Bu Həftə</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <TShirt size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider">Populyar Məhsul</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Sorğu axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-black/10 focus:border-black"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Inquiries List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Son Sorğular</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Funnel size={14} />
                        <span>Filtr</span>
                    </div>
                </div>

                {inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                            <WhatsappLogo size={32} weight="fill" className="text-green-300" />
                        </div>
                        <p className="font-medium text-gray-500 text-sm">Hələ sorğu yoxdur</p>
                        <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
                            Müştərilər məhsul səhifəsindən WhatsApp-a yönləndirildikdə sorğular burada görünəcək
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors">
                                <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {inquiry.product_image ? (
                                        <Image
                                            src={inquiry.product_image}
                                            alt={inquiry.product_name}
                                            width={48}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <TShirt size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{inquiry.product_name}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <Clock size={10} />
                                        {new Date(inquiry.created_at).toLocaleDateString('az-AZ')}
                                    </p>
                                </div>
                                <WhatsappLogo size={18} weight="fill" className="text-green-500 shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <WhatsappLogo size={20} weight="fill" className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-800">WhatsApp Sorğu Sistemi</p>
                        <p className="text-xs text-green-600/70 mt-1">
                            Müştərilər məhsul səhifəsindən "WhatsApp ilə Soruş" düyməsinə basanda avtomatik olaraq sorğu burada qeydə alınır.
                            Bu, ən çox soruşulan məhsulları izləməyə kömək edir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
