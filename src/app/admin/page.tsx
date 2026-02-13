import { Suspense } from 'react';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Cəmi Məhsul" value="-" />
                <DashboardCard title="Kateqoriyalar" value="-" />
                <DashboardCard title="Sifarişlər" value="0" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Son Əlavələr</h2>
                <div className="text-gray-500 text-sm">Hələ ki məlumat yoxdur.</div>
            </div>
        </div>
    );
}

function DashboardCard({ title, value }: { title: string, value: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
    );
}
