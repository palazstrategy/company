"use client"

import dynamic from 'next/dynamic'

const DynamicCursor = dynamic(
  () => import('@/components/ui/CustomCursor').then(m => ({ default: m.CustomCursor })),
  { ssr: false }
)

export function LazyCustomCursor() {
  return <DynamicCursor />
}
