import { EmulatorConfig } from '@/types'

export const beepbopEmulator: EmulatorConfig = {
  id: 'beepbop',
  name: 'BeepBop Console',
  description: 'A simple beep and bop emulator',
  screenWidth: 320,
  screenHeight: 240,
  games: [
    {
      id: 'hello-world',
      name: 'Hello World',
      description: 'A simple hello world game'
    }
  ]
}