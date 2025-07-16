'use client'

import { EmulatorConfig, GameConfig } from '@/types'
import { BeepBopEmulator } from './BeepBopEmulator'

interface EmulatorContainerProps {
  emulator: EmulatorConfig
  game: GameConfig
}

export default function EmulatorContainer({ emulator, game }: EmulatorContainerProps) {
  switch (emulator.id) {
    case 'beepbop':
      return <BeepBopEmulator game={game} />
    default:
      return (
        <div className="flex items-center justify-center min-h-screen text-white">
          <p>Emulator "{emulator.id}" not found</p>
        </div>
      )
  }
}