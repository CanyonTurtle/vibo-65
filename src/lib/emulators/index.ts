import { EmulatorConfig } from '@/types'

export async function getEmulator(id: string): Promise<EmulatorConfig | null> {
  const emulators: Record<string, EmulatorConfig> = {
    'beepbop': {
      id: 'beepbop',
      name: 'BeepBop Console',
      description: 'A simple beep and bop emulator',
      screenWidth: 320,
      screenHeight: 240
    }
  }
  
  return emulators[id] || null
}