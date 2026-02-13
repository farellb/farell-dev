import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 ml-64">
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
