import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler } from "@phosphor-icons/react";

export function SizeGuideSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-[11px] text-gray-500 underline hover:text-black flex items-center gap-1 transition-colors">
                    <Ruler size={16} /> Ölçü Cədvəli
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto rounded-none p-0">
                <SheetHeader className="px-6 py-6 border-b border-gray-100">
                    <SheetTitle className="text-sm font-bold uppercase tracking-[0.2em] text-left">Ölçü Cədvəli</SheetTitle>
                    <SheetDescription className="text-xs text-gray-400 text-left">
                        Bədən ölçülərinizə uyğun gələn ölçünü tapmaq üçün cədvəli yoxlayın.
                    </SheetDescription>
                </SheetHeader>

                <div className="p-6">
                    <Tabs defaultValue="upper" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-50 p-1 rounded-none">
                            <TabsTrigger value="upper" className="text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none">Üst</TabsTrigger>
                            <TabsTrigger value="lower" className="text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none">Alt</TabsTrigger>
                            <TabsTrigger value="shoes" className="text-[10px] uppercase font-bold tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none">Ayaqqabı</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upper" className="mt-0">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">T-shirt & Köynək</h3>
                                    <div className="border border-gray-100 rounded-none overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                                                <tr>
                                                    <th className="p-3 font-bold">Ölçü</th>
                                                    <th className="p-3 font-medium">Sinə (cm)</th>
                                                    <th className="p-3 font-medium">Bel (cm)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="p-3 font-bold bg-gray-50/50">XS</td><td className="p-3 text-gray-600">86-91</td><td className="p-3 text-gray-600">71-76</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">S</td><td className="p-3 text-gray-600">91-96</td><td className="p-3 text-gray-600">76-81</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">M</td><td className="p-3 text-gray-600">96-101</td><td className="p-3 text-gray-600">81-86</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">L</td><td className="p-3 text-gray-600">101-106</td><td className="p-3 text-gray-600">86-91</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">XL</td><td className="p-3 text-gray-600">106-111</td><td className="p-3 text-gray-600">91-96</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">XXL</td><td className="p-3 text-gray-600">111-116</td><td className="p-3 text-gray-600">96-101</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="lower" className="mt-0">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Şalvar & Jeans</h3>
                                    <div className="border border-gray-100 rounded-none overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                                                <tr>
                                                    <th className="p-3 font-bold">Ölçü</th>
                                                    <th className="p-3 font-medium">Bel (cm)</th>
                                                    <th className="p-3 font-medium">Omba (cm)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="p-3 font-bold bg-gray-50/50">29</td><td className="p-3 text-gray-600">74</td><td className="p-3 text-gray-600">92</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">30</td><td className="p-3 text-gray-600">76</td><td className="p-3 text-gray-600">94</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">31</td><td className="p-3 text-gray-600">79</td><td className="p-3 text-gray-600">97</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">32</td><td className="p-3 text-gray-600">81</td><td className="p-3 text-gray-600">99</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">33</td><td className="p-3 text-gray-600">84</td><td className="p-3 text-gray-600">102</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">34</td><td className="p-3 text-gray-600">86</td><td className="p-3 text-gray-600">104</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">36</td><td className="p-3 text-gray-600">91</td><td className="p-3 text-gray-600">109</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="shoes" className="mt-0">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500 border-b border-gray-100 pb-2">Ayaqqabı</h3>
                                    <div className="border border-gray-100 rounded-none overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                                                <tr>
                                                    <th className="p-3 font-bold">EU</th>
                                                    <th className="p-3 font-medium">US</th>
                                                    <th className="p-3 font-medium">UK</th>
                                                    <th className="p-3 font-medium">CM</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="p-3 font-bold bg-gray-50/50">40</td><td className="p-3 text-gray-600">7</td><td className="p-3 text-gray-600">6</td><td className="p-3 text-gray-600">25.0</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">41</td><td className="p-3 text-gray-600">8</td><td className="p-3 text-gray-600">7</td><td className="p-3 text-gray-600">26.0</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">42</td><td className="p-3 text-gray-600">8.5</td><td className="p-3 text-gray-600">7.5</td><td className="p-3 text-gray-600">26.5</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">43</td><td className="p-3 text-gray-600">9.5</td><td className="p-3 text-gray-600">8.5</td><td className="p-3 text-gray-600">27.5</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">44</td><td className="p-3 text-gray-600">10</td><td className="p-3 text-gray-600">9</td><td className="p-3 text-gray-600">28.0</td></tr>
                                                <tr><td className="p-3 font-bold bg-gray-50/50">45</td><td className="p-3 text-gray-600">11</td><td className="p-3 text-gray-600">10</td><td className="p-3 text-gray-600">29.0</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}
