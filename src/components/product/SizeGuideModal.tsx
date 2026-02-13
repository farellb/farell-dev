import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Ruler } from "@phosphor-icons/react";
import { ReactNode } from "react";

interface SizeGuideModalProps {
    children?: ReactNode;
}

export function SizeGuideModal({ children }: SizeGuideModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <button className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-black uppercase tracking-wider underline">
                        <Ruler size={14} /> ÖLÇÜ CƏDVƏLİ
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] overflow-y-auto w-[95vw]">
                <DialogHeader className="border-b pb-4 mb-6">
                    <DialogTitle className="uppercase tracking-widest font-bold text-center text-xl">ÖLÇÜ VƏ UYĞUNLUQ</DialogTitle>
                </DialogHeader>

                <div className="space-y-10">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest">BƏDƏN ÖLÇÜLƏRİ</h3>
                    </div>

                    {/* Table */}
                    <div className="border border-gray-200 overflow-x-auto">
                        <table className="w-full text-xs text-center border-collapse min-w-[500px]">
                            <thead className="bg-white border-b border-gray-200">
                                <tr>
                                    <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Ölçü</th>
                                    <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Avropa (EU)</th>
                                    <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Sinə (cm)</th>
                                    <th className="py-4 font-bold uppercase border-r border-gray-200 w-1/5">Qol (cm)</th>
                                    <th className="py-4 font-bold uppercase w-1/5">Bel (cm)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {/* XS */}
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>XS</td>
                                    <td className="py-2 border-r border-gray-200">40</td>
                                    <td className="py-2 border-r border-gray-200">80</td>
                                    <td className="py-2 border-r border-gray-200">61.5</td>
                                    <td className="py-2">68</td>
                                </tr>
                                <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 border-r border-gray-200">42</td>
                                    <td className="py-2 border-r border-gray-200">84</td>
                                    <td className="py-2 border-r border-gray-200">62</td>
                                    <td className="py-2">72</td>
                                </tr>

                                {/* S */}
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>S</td>
                                    <td className="py-2 border-r border-gray-200">44</td>
                                    <td className="py-2 border-r border-gray-200">88</td>
                                    <td className="py-2 border-r border-gray-200">62.5</td>
                                    <td className="py-2">76</td>
                                </tr>
                                <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 border-r border-gray-200">46</td>
                                    <td className="py-2 border-r border-gray-200">92</td>
                                    <td className="py-2 border-r border-gray-200">63</td>
                                    <td className="py-2">80</td>
                                </tr>

                                {/* M */}
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>M</td>
                                    <td className="py-2 border-r border-gray-200">48</td>
                                    <td className="py-2 border-r border-gray-200">96</td>
                                    <td className="py-2 border-r border-gray-200">63.5</td>
                                    <td className="py-2">84</td>
                                </tr>
                                <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 border-r border-gray-200">50</td>
                                    <td className="py-2 border-r border-gray-200">100</td>
                                    <td className="py-2 border-r border-gray-200">64</td>
                                    <td className="py-2">88</td>
                                </tr>

                                {/* L */}
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>L</td>
                                    <td className="py-2 border-r border-gray-200">52</td>
                                    <td className="py-2 border-r border-gray-200">104</td>
                                    <td className="py-2 border-r border-gray-200">64.5</td>
                                    <td className="py-2">92</td>
                                </tr>
                                <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 border-r border-gray-200">54</td>
                                    <td className="py-2 border-r border-gray-200">108</td>
                                    <td className="py-2 border-r border-gray-200">65</td>
                                    <td className="py-2">96</td>
                                </tr>

                                {/* XL */}
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 border-r border-gray-200 align-middle" rowSpan={2}>XL</td>
                                    <td className="py-2 border-r border-gray-200">56</td>
                                    <td className="py-2 border-r border-gray-200">112</td>
                                    <td className="py-2 border-r border-gray-200">65.5</td>
                                    <td className="py-2">100</td>
                                </tr>
                                <tr className="bg-gray-50/30 hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 border-r border-gray-200">58</td>
                                    <td className="py-2 border-r border-gray-200">116</td>
                                    <td className="py-2 border-r border-gray-200">66</td>
                                    <td className="py-2">104</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Visual Guide Section */}
                    <div className="py-6">
                        {/* Body Diagram with Labels */}
                        <div className="flex justify-center mb-10">
                            <svg width="326" height="530" viewBox="0 0 326 530" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[280px] h-auto text-gray-900">
                                <defs>
                                    <mask id="mask_full_body" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="50" y="0" width="226" height="530">
                                        <path d="M280 0H40V530H280V0Z" fill="white" />
                                    </mask>
                                </defs>
                                <g mask="url(#mask_full_body)">
                                    {/* Body Paths - Unmasked to show full hands and legs */}
                                    <path d="M142.177 0C142.177 0 143.28 18.266 142.177 19.9272C141.074 21.5885 136.222 22.4585 125.014 25.752C115.432 25.752 101.101 29.3296 97.7649 32.6392C91.6022 38.7538 91.4794 44.7212 89.7576 53.2303C84.29 80.2505 87.9609 126.388 87.9609 126.388C87.9609 126.388 84.178 140.08 82.6073 149.045C78.3022 173.616 81.4095 212.921 81.4095 212.921C81.4095 212.921 78.2381 227.001 81.4095 235.032C85.4354 245.227 98.88 253.321 102.702 253.321C106.523 253.321 81.7357 236.082 87.9609 226.977C92.8745 219.791 99.562 240.092 100.161 235.032C100.76 229.972 99.7691 227.534 98.0693 217.562C96.867 210.508 92.8745 207.189 92.8745 207.189V191.629C92.8745 191.629 100.796 166.979 103.521 150.683C105.341 139.791 106.523 122.566 106.523 122.566L114.114 89.263" stroke="currentColor" strokeWidth="0.8" />
                                    <path d="M114.113 89.2612C114.113 89.2612 117.287 103.057 118.208 112.191C118.967 119.722 118.754 135.166 118.754 135.166C118.754 135.166 112.608 153.439 110.565 167.878C109.216 177.407 106.75 182.835 106.258 192.446C105.311 210.971 105.225 243.224 106.748 261.711C107.578 271.779 115.731 323.995 115.731 323.995L118.127 340.165C118.127 344.956 110.641 368.911 113.635 389.872C116.63 410.833 128.008 461.439 128.008 461.439C128.008 461.439 126.654 465.926 126.511 469.224C126.391 472.001 126.511 476.111 126.511 476.111C126.511 476.111 129.188 493.219 123.199 503.999C117.211 514.779 128.328 516.404 134.933 520.532C139.199 523.199 149.269 517.434 149.269 517.434L145.975 480.603L144.533 474.132C144.533 474.132 145.851 471.069 145.975 469.224C146.195 465.93 145.975 461.439 145.975 461.439L150.766 358.73" stroke="currentColor" strokeWidth="0.8" />
                                    <path d="M160.051 203.32C160.051 203.32 157.635 222.611 157.837 235.304C158.487 276.197 151.966 339.866 151.966 339.866L149.57 348.55L150.768 359.03" stroke="currentColor" strokeWidth="0.8" />
                                    <path d="M177.823 0C177.823 0 176.72 18.266 177.823 19.9272C178.926 21.5885 183.778 22.4585 194.986 25.752C204.568 25.752 218.899 29.3296 222.235 32.6392C228.398 38.7538 228.521 44.7212 230.242 53.2303C235.71 80.2505 232.039 126.388 232.039 126.388C232.039 126.388 235.822 140.08 237.393 149.045C241.698 173.616 238.59 212.921 238.59 212.921C238.59 212.921 241.762 227.001 238.59 235.032C234.565 245.227 221.12 253.321 217.298 253.321C213.477 253.321 237.256 222.48 227.126 226.843C219.898 229.955 218.496 251.411 216.585 243.221C214.674 235.032 217.163 226.484 221.931 217.562C224.363 213.01 227.126 207.189 227.126 207.189V191.629C227.126 191.629 219.204 166.979 216.479 150.683C214.659 139.791 213.477 122.566 213.477 122.566L205.886 89.263" stroke="currentColor" strokeWidth="0.8" />
                                    <path d="M205.887 89.2612C205.887 89.2612 202.713 103.057 201.793 112.191C201.033 119.722 201.247 135.166 201.247 135.166C201.247 135.166 207.392 153.439 209.436 167.878C210.784 177.407 211.454 182.835 211.946 192.446C212.893 210.971 214.776 243.224 213.253 261.711C212.423 271.779 204.269 323.995 204.269 323.995L201.874 340.165C201.874 344.956 209.36 368.911 206.365 389.872C203.371 410.833 191.992 461.439 191.992 461.439C191.992 461.439 193.346 465.926 193.489 469.224C193.61 472.001 193.489 476.111 193.489 476.111C193.489 476.111 193.776 501.865 197.331 508.265C200.887 514.665 191.992 517.434 185.598 521.599C179.944 525.281 170.732 517.434 170.732 517.434L174.026 480.603L174.931 473.599C174.931 473.599 174.149 471.069 174.026 469.224C173.805 465.93 174.026 461.439 174.026 461.439L169.235 358.73" stroke="currentColor" strokeWidth="0.8" />
                                    <path d="M160.051 203.32C160.051 203.32 162.369 222.611 162.167 235.304C161.517 276.197 168.038 339.866 168.038 339.866L170.434 348.55L169.236 359.03" stroke="currentColor" strokeWidth="0.8" />
                                </g>

                                {/* Measurements & Labels - Text in Box */}
                                {/* CHEST */}
                                <path d="M97 62L102 64.8868V59.1132L97 62ZM220 62L215 59.1132V64.8868L220 62ZM101.5 62.5H215.5V61.5H101.5V62.5Z" fill="#080808" fillOpacity="0.15" />
                                <rect x="133" y="52" width="54" height="20" fill="#F3F3F3" />
                                <text x="160" y="65" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">SİNƏ</text>

                                {/* WAIST */}
                                <path d="M97 133L102 135.887V130.113L97 133ZM220 133L215 130.113V135.887L220 133ZM101.5 133.5H215.5V132.5H101.5V133.5Z" fill="#080808" fillOpacity="0.15" />
                                <rect x="133" y="123" width="54" height="20" fill="#F3F3F3" />
                                <text x="160" y="136" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">BEL</text>

                                {/* HIPS (KALÇA) */}
                                <path d="M97 204L102 206.887V201.113L97 204ZM220 204L215 201.113V206.887L220 204ZM101.5 204.5H215.5V203.5H101.5V204.5Z" fill="#080808" fillOpacity="0.15" />
                                <rect x="133" y="196" width="54" height="20" fill="#F3F3F3" />
                                <text x="160" y="209" fontSize="10" fill="#000" textAnchor="middle" fontWeight="bold">KALÇA</text>

                                {/* ARM LENGTH */}
                                <path d="M232 53 L229 58 H235 Z" fill="#080808" fillOpacity="0.15" />
                                <path d="M232 230 L229 225 H235 Z" fill="#080808" fillOpacity="0.15" />
                                <line x1="232" y1="56" x2="232" y2="227" stroke="#080808" strokeOpacity="0.15" strokeWidth="1" />
                                <rect x="238" y="135" width="70" height="20" fill="#F3F3F3" />
                                <text x="273" y="148" fontSize="9" fill="#000" textAnchor="middle" fontWeight="bold">QOL UZUNLUĞU</text>
                            </svg>
                        </div>

                        {/* Instructions List - Split Layout Title Left / Description Right */}
                        <div className="space-y-8 max-w-3xl mx-auto px-4">
                            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Sinə</h4>
                                <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                    Lentinizi sinənizin ən geniş hissəsinə üfüqi şəkildə tutaraq ölçün.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Bel</h4>
                                <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                    Təbii bel xəttinizin ətrafını, ən incə nöqtədən ölçün.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Kalça</h4>
                                <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                    Ayaqlarınızı birləşdirərək, kalçanızın ən geniş hissəsini ölçün.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 sm:gap-12 group">
                                <h4 className="font-bold text-sm uppercase flex-shrink-0 w-32">Qol Uzunluğu</h4>
                                <p className="text-sm text-gray-500 leading-relaxed text-right sm:text-right flex-1">
                                    Çiyin nöqtəsindən biləyinizə qədər olan məsafəni ölçün.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
