'use client'

import { EmulatorConfig, GameBase, Vibo22gEmulatorConfig } from '@/types'
import { BeepBopEmulator } from './BeepBopEmulator'
import { Vibo22gEmulator } from './Vibo22gEmulator'

interface EmulatorContainerProps {
  emulator: EmulatorConfig
  game: GameBase
}

export default function EmulatorContainer({ emulator, game }: EmulatorContainerProps) {
  switch (emulator.id) {
    case 'beepbop':
      return <BeepBopEmulator game={game} />
    case 'vibo-22g':
      const vibo22gConfig = emulator as Vibo22gEmulatorConfig
      return <Vibo22gEmulator game={game} smallerDimension={vibo22gConfig.smallerDimension} />
    default:
      return (
        <div className="flex items-center justify-center min-h-screen text-white">
          <p>Emulator &quot;{emulator.id}&quot; not found</p>
        </div>
      )
  }
}