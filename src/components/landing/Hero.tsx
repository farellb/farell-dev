import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

export function Hero() {
    return (
        <section className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gray-50">
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-white/50 pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                <h1 className="text-4xl md:text-6xl tracking-tighter text-foreground sm:text-5xl">
                    Detalları gör, fərqi hiss et
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                    Stil səs çıxarmadan da fərq yaradır.
                </p>

                <div className="flex gap-4 mt-4">
                    <Button asChild size="lg" className="rounded-full px-8 text-base">
                        <Link href="/category/men">
                            Kişi
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8 text-base gap-2">
                        <Link href="/category/women">
                            Qadın <ArrowRight weight="bold" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
