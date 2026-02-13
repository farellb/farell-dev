"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Gear, WhatsappLogo, Globe, InstagramLogo,
    Image as ImageIcon, Phone, Envelope, MapPin,
    FloppyDisk, PencilSimple, Check
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SiteSettings {
    site_name: string;
    whatsapp_number: string;
    instagram_url: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    whatsapp_message_template: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
    site_name: "Farell Brooklyn",
    whatsapp_number: "",
    instagram_url: "",
    email: "",
    phone: "",
    address: "",
    currency: "AZN",
    whatsapp_message_template: "Salam, bu məhsul haqqında məlumat almaq istəyirəm: {product_name}",
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState("general");

    const handleChange = (key: keyof SiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setLoading(true);
        // TODO: Save to Supabase settings table
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 500);
    };

    const sections = [
        { id: "general", label: "Ümumi", icon: Globe },
        { id: "contact", label: "Əlaqə", icon: Phone },
        { id: "whatsapp", label: "WhatsApp", icon: WhatsappLogo },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Tənzimləmələr</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Sayt parametrlərini idarə edin</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={loading || saved}
                    className={cn(
                        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                        saved
                            ? "bg-green-600 hover:bg-green-600 text-white"
                            : "bg-black hover:bg-gray-800 text-white hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5"
                    )}
                >
                    {saved ? (
                        <>
                            <Check size={16} weight="bold" />
                            Saxlanıldı
                        </>
                    ) : (
                        <>
                            <FloppyDisk size={16} weight="bold" />
                            Yadda Saxla
                        </>
                    )}
                </Button>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {sections.map(section => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeSection === section.id
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Icon size={16} weight={activeSection === section.id ? "fill" : "regular"} />
                            {section.label}
                        </button>
                    );
                })}
            </div>

            {/* General Section */}
            {activeSection === "general" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Ümumi Parametrlər</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Sayt haqqında əsas məlumatlar</p>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Sayt Adı</Label>
                            <Input
                                value={settings.site_name}
                                onChange={(e) => handleChange("site_name", e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                                placeholder="Mağaza adı"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Valyuta</Label>
                            <div className="flex gap-2">
                                {["AZN", "USD", "EUR", "TRY"].map(cur => (
                                    <button
                                        key={cur}
                                        onClick={() => handleChange("currency", cur)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                                            settings.currency === cur
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        {cur === "AZN" ? "₼ AZN" : cur === "USD" ? "$ USD" : cur === "EUR" ? "€ EUR" : "₺ TRY"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Section */}
            {activeSection === "contact" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Əlaqə Məlumatları</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Müştərilərin sizə çata biləcəyi məlumatlar</p>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                Telefon
                            </Label>
                            <Input
                                value={settings.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                                placeholder="+994 XX XXX XX XX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Envelope size={14} className="text-gray-400" />
                                E-poçt
                            </Label>
                            <Input
                                value={settings.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                                placeholder="info@farell.az"
                                type="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <InstagramLogo size={14} className="text-gray-400" />
                                Instagram
                            </Label>
                            <Input
                                value={settings.instagram_url}
                                onChange={(e) => handleChange("instagram_url", e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                                placeholder="https://instagram.com/farell.brooklyn"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MapPin size={14} className="text-gray-400" />
                                Ünvan
                            </Label>
                            <Input
                                value={settings.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="h-11 rounded-xl border-gray-200"
                                placeholder="Bakı, Azərbaycan"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Section */}
            {activeSection === "whatsapp" && (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">WhatsApp Tənzimləmələri</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Müştəri sorğu sistemi konfiqurasiyası</p>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <WhatsappLogo size={14} weight="fill" className="text-green-600" />
                                    WhatsApp Nömrəsi
                                </Label>
                                <Input
                                    value={settings.whatsapp_number}
                                    onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                                    className="h-11 rounded-xl border-gray-200"
                                    placeholder="+994XXXXXXXXX"
                                />
                                <p className="text-xs text-gray-400">Ölkə kodu ilə birlikdə, boşluqsuz daxil edin</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Mesaj Şablonu</Label>
                                <textarea
                                    value={settings.whatsapp_message_template}
                                    onChange={(e) => handleChange("whatsapp_message_template", e.target.value)}
                                    className="w-full min-h-[100px] rounded-xl border border-gray-200 p-3 text-sm resize-none focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all"
                                    placeholder="Müştərinin WhatsApp-a göndərəcəyi mesaj şablonu"
                                />
                                <p className="text-xs text-gray-400">
                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">{"{product_name}"}</code> — məhsul adı ilə əvəz olunacaq
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
                        <p className="text-sm font-medium text-green-800 mb-3">Önbaxış</p>
                        <div className="bg-white rounded-xl p-4 border border-green-200/50 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                    <WhatsappLogo size={16} weight="fill" className="text-white" />
                                </div>
                                <div className="bg-green-50 rounded-lg rounded-tl-none px-3 py-2">
                                    <p className="text-sm text-gray-700">
                                        {settings.whatsapp_message_template.replace("{product_name}", "Oversize T-shirt — Black")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
