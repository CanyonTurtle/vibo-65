export interface GameBase {
  id: string
  title: string
  description: string
  date: string
  author: string
  previewImageLink?: string
}

export interface EmulatorBase {
  id: string
  name: string
  description: string
  author: string
  date: string
  previewImageLink?: string
}

export interface GameConfig extends GameBase {
  // Games can extend this with emulator-specific properties
}

export interface EmulatorConfig extends EmulatorBase {
  screenWidth: number
  screenHeight: number
  games: GameConfig[]
}

// BeepBop specific interfaces
export interface BeepBopGameConfig extends GameBase {
  beepFrequency?: number
  bopFrequency?: number
  soundEnabled?: boolean
}

export interface BeepBopEmulatorConfig extends EmulatorBase {
  screenWidth: number
  screenHeight: number
  games: BeepBopGameConfig[]
  defaultVolume?: number
  audioBufferSize?: number
}

export interface BeepBopInterface {
  beep(): void
  bop(): void
}