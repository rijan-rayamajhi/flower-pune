"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc";

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = OPTIONS.find((o) => o.value === value)?.label;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-burgundy transition-colors group"
            >
                <span className="text-charcoal/60">Sort by:</span>
                <span className="font-bold">{selectedLabel}</span>
                <ChevronDown
                    className={`h-4 w-4 text-charcoal/60 transition-transform duration-300 group-hover:text-burgundy ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-sm bg-white p-2 shadow-luxury ring-1 ring-black/5 z-30"
                    >
                        {OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ${value === option.value
                                        ? "bg-burgundy/5 text-burgundy font-medium"
                                        : "text-charcoal hover:bg-gray-50"
                                    }`}
                            >
                                {option.label}
                                {value === option.value && <Check className="h-4 w-4 text-burgundy" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
