"use client"

import { useRef, useState } from "react"
import {  m  } from 'framer-motion'

export function Magnetic({ children, strength = 20 }: { children: React.ReactNode, strength?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current!.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * (strength / 100), y: middleY * (strength / 100) })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <m.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
            className="inline-block"
            data-magnetic-snap="true"
        >
            {children}
        </m.div>
    )
}
