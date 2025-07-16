import { EmulatorConfig } from '@/types'
import { beepbopEmulator } from './beepbop'

const emulators: EmulatorConfig[] = [
  beepbopEmulator
]

export function getEmulators(): EmulatorConfig[] {
  return emulators
}

export function getEmulator(id: string): EmulatorConfig | null {
  return emulators.find(emulator => emulator.id === id) || null
}