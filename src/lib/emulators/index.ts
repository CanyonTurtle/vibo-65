import { EmulatorConfig } from '@/types'
import { beepbopEmulator } from './beepbop'
import { vibo22gEmulator } from './vibo-22g'

const emulators: EmulatorConfig[] = [
  beepbopEmulator,
  vibo22gEmulator
]

export function getEmulators(): EmulatorConfig[] {
  return emulators
}

export function getEmulator(id: string): EmulatorConfig | null {
  return emulators.find(emulator => emulator.id === id) || null
}