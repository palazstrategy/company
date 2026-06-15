"use client";
import { useEffect, useRef } from "react";
import { X, AlertTriangle, AlertCircle } from "lucide-react";

interface ModalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: "confirm" | "alert";
    variant?: "danger" | "warning" | "info";
    confirmLabel?: string;
    cancelLabel?: string;
}

export function ModalDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "alert",
    variant = "info",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar"
}: ModalDialogProps) {
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            confirmRef.current?.focus();
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape") onClose();
            };
            window.addEventListener("keydown", handleEscape);
            return () => window.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const iconMap = {
        danger: <AlertTriangle size={20} className="text-red-400" />,
        warning: <AlertCircle size={20} className="text-amber-400" />,
        info: <AlertCircle size={20} className="text-blue-400" />
    };

    const confirmBtnClass = {
        danger: "bg-red-600 hover:bg-red-500",
        warning: "bg-amber-600 hover:bg-amber-500",
        info: "bg-[#F24B0F] hover:bg-[#F24B0F]/80"
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            {iconMap[variant]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0">
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="p-4 border-t border-white/5 flex items-center justify-end gap-3">
                    {type === "confirm" && (
                        <button
                            onClick={onClose}
                            className="px-5 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            {cancelLabel}
                        </button>
                    )}
                    <button
                        ref={confirmRef}
                        onClick={() => {
                            if (type === "confirm" && onConfirm) onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-full transition-all ${confirmBtnClass[variant]}`}
                    >
                        {type === "confirm" ? confirmLabel : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
}
