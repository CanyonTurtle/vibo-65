'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { GameBase, Vibo22gAPI, Vibo22gGame } from '@/types'

interface Vibo22gEmulatorProps {
  game: GameBase
  smallerDimension: number
}

export function Vibo22gEmulator({ game, smallerDimension }: Vibo22gEmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const gameInstanceRef = useRef<Vibo22gGame | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const keyStateRef = useRef<Map<string, boolean>>(new Map())
  const animationIdRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })
  const [pixelSize, setPixelSize] = useState({ width: 0, height: 0 })

  // Sound oscillators for 4 channels
  const oscillatorsRef = useRef<(OscillatorNode | null)[]>([null, null, null, null])
  const gainNodesRef = useRef<(GainNode | null)[]>([null, null, null, null])

  // Calculate screen dimensions with fluid aspect ratio
  const calculateScreenSize = useCallback(() => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const windowAspect = windowWidth / windowHeight

    let pixelWidth: number
    let pixelHeight: number

    if (windowWidth < windowHeight) {
      // Portrait: smaller dimension is width
      pixelWidth = smallerDimension
      pixelHeight = Math.floor(smallerDimension / windowAspect)
    } else {
      // Landscape: smaller dimension is height
      pixelHeight = smallerDimension
      pixelWidth = Math.floor(smallerDimension * windowAspect)
    }

    // Calculate actual screen size (scaled up to fill entire viewport)
    const scale = Math.min(windowWidth / pixelWidth, windowHeight / pixelHeight)
    const screenWidth = Math.floor(pixelWidth * scale)
    const screenHeight = Math.floor(pixelHeight * scale)

    setPixelSize({ width: pixelWidth, height: pixelHeight })
    setScreenSize({ width: screenWidth, height: screenHeight })
  }, [smallerDimension])

  // Drawing API implementation
  const drawingAPI = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx || !pixelSize.width || !pixelSize.height) return null

    return {
      drawPixel: (x: number, y: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1)
      },

      drawLine: (x1: number, y1: number, x2: number, y2: number, color: string) => {
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(Math.floor(x1) + 0.5, Math.floor(y1) + 0.5)
        ctx.lineTo(Math.floor(x2) + 0.5, Math.floor(y2) + 0.5)
        ctx.stroke()
      },

      drawRect: (x1: number, y1: number, x2: number, y2: number, color: string, filled = false) => {
        const left = Math.min(x1, x2)
        const top = Math.min(y1, y2)
        const width = Math.abs(x2 - x1)
        const height = Math.abs(y2 - y1)

        if (filled) {
          ctx.fillStyle = color
          ctx.fillRect(Math.floor(left), Math.floor(top), Math.ceil(width), Math.ceil(height))
        } else {
          ctx.strokeStyle = color
          ctx.lineWidth = 1
          ctx.strokeRect(Math.floor(left) + 0.5, Math.floor(top) + 0.5, Math.floor(width), Math.floor(height))
        }
      },

      clearScreen: (color = '#000000') => {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, pixelSize.width, pixelSize.height)
      },

      getScreenWidth: () => pixelSize.width,
      getScreenHeight: () => pixelSize.height
    }
  }, [pixelSize])

  // Sound API implementation
  const soundAPI = useCallback(() => {
    const audioCtx = audioContextRef.current
    if (!audioCtx) return null

    return {
      playNote: (channel: number, frequency: number, duration: number) => {
        if (channel < 0 || channel > 3) return

        // Stop existing oscillator on this channel
        if (oscillatorsRef.current[channel]) {
          oscillatorsRef.current[channel]!.stop()
          oscillatorsRef.current[channel] = null
        }

        // Create new oscillator
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        
        oscillator.type = 'square' // 8-bit style square wave
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
        
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        
        oscillator.start()
        oscillator.stop(audioCtx.currentTime + duration)
        
        oscillatorsRef.current[channel] = oscillator
        gainNodesRef.current[channel] = gainNode
        
        // Clean up after duration
        setTimeout(() => {
          if (oscillatorsRef.current[channel] === oscillator) {
            oscillatorsRef.current[channel] = null
            gainNodesRef.current[channel] = null
          }
        }, duration * 1000)
      },

      stopChannel: (channel: number) => {
        if (channel < 0 || channel > 3) return
        if (oscillatorsRef.current[channel]) {
          oscillatorsRef.current[channel]!.stop()
          oscillatorsRef.current[channel] = null
          gainNodesRef.current[channel] = null
        }
      },

      stopAllChannels: () => {
        for (let i = 0; i < 4; i++) {
          if (oscillatorsRef.current[i]) {
            oscillatorsRef.current[i]!.stop()
            oscillatorsRef.current[i] = null
            gainNodesRef.current[i] = null
          }
        }
      }
    }
  }, [])

  // Input API implementation
  const inputAPI = useCallback(() => ({
    getKey: (key: string) => keyStateRef.current.get(key.toLowerCase()) || false
  }), [])

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = (currentTime - lastTimeRef.current) / 1000
    lastTimeRef.current = currentTime

    const game = gameInstanceRef.current
    const draw = drawingAPI()
    const sound = soundAPI()
    const input = inputAPI()

    if (game && draw && sound && input) {
      const api: Vibo22gAPI = { draw, sound, input }
      game.update(api, deltaTime)
    }

    animationIdRef.current = requestAnimationFrame(gameLoop)
  }, [drawingAPI, soundAPI, inputAPI])

  // Load game ROM
  const loadGame = useCallback(async () => {
    try {
      // Dynamic import of the game ROM
      const gameModule = await import(`@/games/vibo22g/${game.id}`)
      const gameInstance: Vibo22gGame = gameModule.default || gameModule

      gameInstanceRef.current = gameInstance

      // Initialize game if it has an init function
      const draw = drawingAPI()
      const sound = soundAPI()
      const input = inputAPI()

      if (gameInstance.init && draw && sound && input) {
        const api: Vibo22gAPI = { draw, sound, input }
        gameInstance.init(api)
      }

      // Start game loop
      lastTimeRef.current = performance.now()
      animationIdRef.current = requestAnimationFrame(gameLoop)
    } catch (error) {
      console.error('Failed to load game:', error)
    }
  }, [game.id, drawingAPI, soundAPI, inputAPI, gameLoop])

  // Initialize emulator
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set up canvas
    canvas.width = pixelSize.width
    canvas.height = pixelSize.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false
    contextRef.current = ctx

    // Initialize audio context
    try {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch (error) {
      console.warn('Audio context not available:', error)
    }

    // Load and start the game
    loadGame()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [pixelSize, loadGame])

  // Handle window resize
  useEffect(() => {
    calculateScreenSize()
    
    const handleResize = () => calculateScreenSize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateScreenSize])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keyStateRef.current.set(event.key.toLowerCase(), true)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keyStateRef.current.set(event.key.toLowerCase(), false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-600"
          style={{
            width: `${screenSize.width}px`,
            height: `${screenSize.height}px`,
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Game info overlay */}
        <div className="absolute top-2 left-2 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
          {game.title} - {pixelSize.width}×{pixelSize.height}
        </div>
      </div>
    </div>
  )
}