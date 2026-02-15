"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// SVG petal shapes for floating decorations
function Petal({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 40" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C12 0 24 14 24 24C24 32.837 18.627 40 12 40C5.373 40 0 32.837 0 24C0 14 12 0 12 0Z" />
        </svg>
    );
}

function Leaf({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <path d="M28 4C28 4 30 16 22 24C14 32 2 28 2 28C2 28 0 16 8 8C16 0 28 4 28 4Z" />
            <path d="M4 28L16 16" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
        </svg>
    );
}

function SmallFlower({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" opacity="0.8" />
            <ellipse cx="12" cy="5" rx="3" ry="5" opacity="0.5" />
            <ellipse cx="12" cy="19" rx="3" ry="5" opacity="0.5" />
            <ellipse cx="5" cy="12" rx="5" ry="3" opacity="0.5" />
            <ellipse cx="19" cy="12" rx="5" ry="3" opacity="0.5" />
        </svg>
    );
}

// Data for the floating decorative elements
const floatingElements = [
    { type: "petal", x: "-10%", y: "10%", size: "w-3 h-5 sm:w-4 sm:h-6", delay: "0s", duration: "6s", color: "text-champagne/25" },
    { type: "leaf", x: "105%", y: "20%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: "1.5s", duration: "7s", color: "text-sage/20" },
    { type: "petal", x: "95%", y: "70%", size: "w-2.5 h-4 sm:w-3 sm:h-5", delay: "3s", duration: "8s", color: "text-burgundy/15" },
    { type: "flower", x: "-5%", y: "65%", size: "w-3.5 h-3.5 sm:w-4 sm:h-4", delay: "2s", duration: "9s", color: "text-blush/30" },
    { type: "leaf", x: "50%", y: "-5%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: "4s", duration: "7.5s", color: "text-champagne/20" },
    { type: "petal", x: "80%", y: "5%", size: "w-2 h-3 sm:w-3 sm:h-4", delay: "0.8s", duration: "6.5s", color: "text-sage/15" },
];

interface SectionTitleProps {
    subtitle?: string;
    title: string;
    titleHighlight?: string; // optional italic highlighted word
    description?: string;
    variant?: "light" | "dark";
    className?: string;
}

export default function SectionTitle({
    subtitle,
    title,
    titleHighlight,
    description,
    variant = "light",
    className = "",
}: SectionTitleProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

    const isDark = variant === "dark";

    // Color tokens based on variant
    const dividerColor = isDark ? "bg-champagne/40" : "bg-champagne/60";
    const dotColor = isDark ? "bg-champagne/60" : "bg-champagne";
    const subtitleColor = isDark ? "text-champagne/80" : "text-burgundy/70";
    const titleColor = isDark ? "text-white" : "text-charcoal";
    const descriptionColor = isDark ? "text-white/60" : "text-charcoal/60";
    const highlightColor = isDark ? "text-blush" : "text-burgundy/90";

    const ElementIcon = ({ type, elClassName }: { type: string; elClassName?: string }) => {
        switch (type) {
            case "leaf": return <Leaf className={elClassName} />;
            case "flower": return <SmallFlower className={elClassName} />;
            default: return <Petal className={elClassName} />;
        }
    };

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Floating botanical decorations — hidden on small screens for performance */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
                {floatingElements.map((el, i) => (
                    <div
                        key={i}
                        className={`absolute ${el.size} ${el.color} animate-float-petal`}
                        style={{
                            left: el.x,
                            top: el.y,
                            animationDelay: el.delay,
                            animationDuration: el.duration,
                        }}
                    >
                        <ElementIcon type={el.type} elClassName="w-full h-full" />
                    </div>
                ))}
            </div>

            {/* Gold Divider with Shimmer */}
            <motion.div
                className="flex items-center justify-center mb-8 md:mb-12"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className={`h-px w-12 ${dividerColor} animate-shimmer`} />
                <div className="relative mx-4">
                    <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                    {/* Sparkle ring around dot */}
                    <div className={`absolute -inset-1.5 rounded-full border ${isDark ? "border-champagne/20" : "border-champagne/30"} animate-sparkle`} />
                </div>
                <div className={`h-px w-12 ${dividerColor} animate-shimmer`} />
            </motion.div>

            {/* Text content */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {subtitle && (
                    <p className={`text-xs sm:text-sm font-medium uppercase tracking-[0.2em] ${subtitleColor} mb-2 sm:mb-3`}>
                        {subtitle}
                    </p>
                )}

                <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${titleColor} mb-3 sm:mb-4`}>
                    {title}
                    {titleHighlight && (
                        <>
                            {" "}
                            <span className={`italic ${highlightColor}`}>{titleHighlight}</span>
                        </>
                    )}
                </h2>

                {description && (
                    <p className={`${descriptionColor} max-w-2xl mx-auto font-serif italic text-base sm:text-lg`}>
                        {description}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
