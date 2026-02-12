"use client";

import { cn } from "@/lib/utils";

interface StaticLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    maxWidth?: "xl" | "2xl" | "3xl" | "4xl" | "full";
    className?: string;
}

const StaticLayout = ({
    title,
    subtitle,
    children,
    maxWidth = "2xl",
    className
}: StaticLayoutProps) => {

    const maxWidthClasses = {
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "full": "max-w-full"
    };

    return (
        <section className={cn("py-20 md:py-28 bg-ivory text-charcoal", className)}>
            <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidthClasses[maxWidth])}>
                <div className="mb-16 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg text-charcoal/70 font-light max-w-lg mx-auto leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                    <div className="mt-8 mx-auto w-16 h-px bg-burgundy/30" />
                </div>

                <div className="prose prose-lg prose-headings:font-serif prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:font-light prose-p:leading-relaxed prose-a:text-burgundy hover:prose-a:text-burgundy/80 prose-strong:text-charcoal prose-strong:font-medium mx-auto">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default StaticLayout;
