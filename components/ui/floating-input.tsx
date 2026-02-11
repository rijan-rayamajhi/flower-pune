import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, label, id, ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    className={cn(
                        "peer block w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-4 pb-2.5 pt-4 text-base text-charcoal focus:border-burgundy focus:outline-none focus:ring-0 placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:transition-opacity",
                        className
                    )}
                    id={id}
                    ref={ref}
                    placeholder={props.placeholder || " "}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className="absolute left-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-charcoal/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-burgundy"
                >
                    {label}
                </label>
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
