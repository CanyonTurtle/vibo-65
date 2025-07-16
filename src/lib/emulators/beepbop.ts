import { BeepBopEmulatorConfig } from '@/types'

export const beepbopEmulator: BeepBopEmulatorConfig = {
  id: 'beepbop',
  name: 'BeepBop Console',
  description: 'A simple beep and bop emulator',
  author: 'Retro Games Inc.',
  date: '2024-01-15',
  previewImageLink: '/images/beepbop-console.png',
  screenWidth: 320,
  screenHeight: 240,
  defaultVolume: 0.7,
  audioBufferSize: 512,
  games: [
    {
      id: 'hello-world',
      title: 'Hello World',
      description: 'A simple hello world game that demonstrates the BeepBop console capabilities',
      author: 'Demo Team',
      date: '2024-01-20',
      previewImageLink: '/images/hello-world-preview.png',
      beepFrequency: 440,
      bopFrequency: 880,
      soundEnabled: true
    }
  ]
}