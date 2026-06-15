'use client'

import { useState, useEffect } from 'react'
import {  m, AnimatePresence  } from 'framer-motion'
import Image from 'next/image'
import { X, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

interface LightboxProps {
    src: string
    isOpen: boolean
    onClose: () => void
}

export function Lightbox({ src, isOpen, onClose }: LightboxProps) {
    const [rotation, setRotation] = useState(0)
    const [scale, setScale] = useState(1)

    // Reset transformations when changing image or closing
    useEffect(() => {
        if (!isOpen) {
            setRotation(0)
            setScale(1)
        }
    }, [isOpen, src])

    const handleRotate = (dir: 'cw' | 'ccw') => {
        setRotation(prev => dir === 'cw' ? prev + 90 : prev - 90)
    }

    const handleZoom = (dir: 'in' | 'out') => {
        setScale(prev => dir === 'in' ? Math.min(prev + 0.2, 3) : Math.max(prev - 0.2, 0.5))
    }

    const isVideo = src.toLowerCase().endsWith('.mp4')

    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
                >
                    {/* Controls Overlay */}
                    <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
                        <button 
                            onClick={() => handleRotate('ccw')}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                            title="Rotate Left"
                        >
                            <RotateCcw className="w-6 h-6 text-white" />
                        </button>
                        <button 
                            onClick={() => handleRotate('cw')}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                            title="Rotate Right"
                        >
                            <RotateCw className="w-6 h-6 text-white" />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md ml-4"
                            title="Close"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Bottom Controls (Zoom) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-[110] bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                        <button onClick={() => handleZoom('out')} className="text-white hover:text-[#A6C4C8] transition-colors">
                            <ZoomOut className="w-6 h-6" />
                        </button>
                        <span className="text-white font-medium min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => handleZoom('in')} className="text-white hover:text-[#A6C4C8] transition-colors">
                            <ZoomIn className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Container */}
                    <m.div
                        className="relative w-full h-full flex items-center justify-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <m.div
                            className="relative max-w-full max-h-full transition-transform duration-300 ease-out flex items-center justify-center"
                            style={{ 
                                rotate: rotation,
                                scale: scale
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={src}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                                />
                            ) : (
                                <div className="relative max-w-full max-h-[85vh] flex items-center justify-center">
                                    <Image
                                        src={src}
                                        alt="Fullscreen view"
                                        width={1920}
                                        height={1080}
                                        className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg select-none pointer-events-none"
                                        unoptimized
                                    />
                                </div>
                            )}
                        </m.div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    )
}
