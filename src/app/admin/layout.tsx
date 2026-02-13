import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <AdminSidebar />
            <div className="lg:ml-[260px] min-h-screen">
                <main className="p-4 sm:p-6 lg:p-10 pt-[72px] lg:pt-10 max-w-[1400px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
