import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, label, id, error, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    className={cn(
                        "peer block w-full appearance-none rounded-lg border bg-transparent px-4 pb-2.5 pt-4 text-base text-charcoal focus:outline-none focus:ring-0 placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:transition-opacity",
                        error
                            ? "border-red-500 text-red-900 focus:border-red-500"
                            : "border-gray-200 focus:border-burgundy",
                        className
                    )}
                    id={id}
                    ref={ref}
                    placeholder={props.placeholder || " "}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        "absolute left-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75",
                        error
                            ? "text-red-500 peer-focus:text-red-500"
                            : "text-charcoal/50 peer-focus:text-burgundy"
                    )}
                >
                    {label}
                </label>
                {error && (
                    <p className="mt-1 text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
