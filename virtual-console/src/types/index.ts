export interface EmulatorConfig {
  id: string
  name: string
  description: string
  screenWidth: number
  screenHeight: number
}

export interface GameConfig {
  id: string
  name: string
  description: string
  emulator: string
}

export interface BeepBopInterface {
  beep(): void
  bop(): void
}