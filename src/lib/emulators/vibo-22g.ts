import { Vibo22gEmulatorConfig } from '@/types'

export const vibo22gEmulator: Vibo22gEmulatorConfig = {
  id: 'vibo-22g',
  name: 'Vibo-22g Console',
  description: '8-bit style retro console with fluid aspect ratio and immediate-mode graphics API',
  author: 'Retro Systems Corp',
  date: '2025-01-16',
  previewImageLink: '/images/vibo-22g-console.png',
  smallerDimension: 140,
  games: [
    {
      id: 'pixel-adventure',
      title: 'Pixel Adventure',
      description: 'A simple demo game showcasing the Vibo-22g graphics and sound API',
      author: 'Demo Studios',
      date: '2025-01-16',
      previewImageLink: '/images/pixel-adventure-preview.png'
    }
  ]
}