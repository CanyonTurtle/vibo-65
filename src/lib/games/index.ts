import { GameBase } from '@/types'
import { getEmulator } from '@/lib/emulators'

export function getGame(emulatorId: string, gameId: string): GameBase | null {
  const emulator = getEmulator(emulatorId)
  if (!emulator) return null
  
  return emulator.games.find(game => game.id === gameId) || null
}