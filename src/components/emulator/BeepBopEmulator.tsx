'use client'

import { GameConfig, BeepBopInterface } from '@/types'
import { useEffect, useRef } from 'react'

interface BeepBopEmulatorProps {
  game: GameConfig
}

export function BeepBopEmulator({ game }: BeepBopEmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const beepbop: BeepBopInterface = {
      beep: () => console.log('BEEP!'),
      bop: () => console.log('BOP!')
    }
    
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#fff'
    ctx.font = '16px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(game.title, canvas.width / 2, canvas.height / 2)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b') beepbop.beep()
      if (e.key === 'p') beepbop.bop()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [game.title])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">BeepBop Console</h1>
        <p className="text-gray-400">{game.description}</p>
      </div>
      
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        className="border border-gray-600 bg-black"
      />
      
      <div className="mt-4 text-sm text-gray-400">
        Press 'b' to beep, 'p' to bop
      </div>
    </div>
  )
}