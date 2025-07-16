import { GameConfig } from '@/types'

export async function getGame(emulator: string, rom: string): Promise<GameConfig | null> {
  const games: Record<string, Record<string, GameConfig>> = {
    'beepbop': {
      'hello-world': {
        id: 'hello-world',
        name: 'Hello World',
        description: 'A simple hello world game',
        emulator: 'beepbop'
      }
    }
  }
  
  return games[emulator]?.[rom] || null
}