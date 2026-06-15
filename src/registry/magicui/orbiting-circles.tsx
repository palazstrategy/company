"use client"

import { cn } from "@/lib/utils"
import React from "react"

export interface OrbitingCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  delay?: number
  radius?: number
  path?: boolean
  iconSize?: number
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
  ...props
}: OrbitingCircleProps) {
  const childrenArray = React.Children.toArray(children)
  
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-white/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {childrenArray.map((child, index) => {
        const angle = (360 / childrenArray.length) * index
        return (
          <div
            key={index}
            style={
              {
                "--duration": `${duration}`,
                "--radius": `${radius}`,
                "--delay": `${-delay}`,
                "--angle": `${angle}`,
                animation: `orbit calc(${duration} * 1s) linear infinite`,
                animationDelay: `calc(${-delay}s)`,
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              } as React.CSSProperties
            }
            className={cn(
              reverse ? "[animation-direction:reverse]" : "",
              className,
            )}
            {...props}
          >
            <div 
              style={{ width: iconSize, height: iconSize }}
              className="flex items-center justify-center"
            >
              {child}
            </div>
          </div>
        )
      })}
    </>
  )
}
