export interface GameConfig {
  id: string
  name: string
  description: string
}

export interface EmulatorConfig {
  id: string
  name: string
  description: string
  screenWidth: number
  screenHeight: number
  games: GameConfig[]
}

export interface BeepBopInterface {
  beep(): void
  bop(): void
}