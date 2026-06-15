import React, { memo, useState, useEffect, useRef } from "react";

interface LocalInputProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
    type?: "text" | "textarea";
}

export const LocalInput = memo(({ value, onChange, className, placeholder, type = "text" }: LocalInputProps) => {
    const [localValue, setLocalValue] = useState(value);
    const lastValue = useRef(value);

    // Sincroniza o estado local se o valor externo mudar (ex: mudança de idioma)
    useEffect(() => {
        if (value !== localValue && value !== lastValue.current) {
            setLocalValue(value);
            lastValue.current = value;
        }
    }, [value, localValue]);

    const handleBlur = () => {
        if (localValue !== value) {
            onChange(localValue);
            lastValue.current = localValue;
        }
    };

    const Tag = type === "textarea" ? "textarea" : "input";

    return (
        <Tag
            value={localValue}
            onChange={(e: any) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className={className}
            placeholder={placeholder}
        />
    );
});

LocalInput.displayName = "LocalInput";
