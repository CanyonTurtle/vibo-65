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

export interface EmulatorConfig extends EmulatorBase {
  screenWidth: number
  screenHeight: number
  games: GameBase[]
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

// Vibo-22g specific interfaces
export type Vibo22gGameConfig = GameBase

export interface Vibo22gEmulatorConfig extends EmulatorBase {
  smallerDimension: number // The size of the smaller screen dimension
  games: Vibo22gGameConfig[]
}

// Vibo-22g API interfaces
export interface Vibo22gDrawingAPI {
  // Drawing primitives
  drawPixel(x: number, y: number, color: string): void
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string): void
  drawRect(x1: number, y1: number, x2: number, y2: number, color: string, filled?: boolean): void
  
  // Screen utilities
  clearScreen(color?: string): void
  getScreenWidth(): number
  getScreenHeight(): number
}

export interface Vibo22gSoundAPI {
  // Sound channels (0-3)
  playNote(channel: number, frequency: number, duration: number): void
  stopChannel(channel: number): void
  stopAllChannels(): void
}

export interface Vibo22gInputAPI {
  // Simple key polling
  getKey(key: string): boolean
}

export interface Vibo22gAPI {
  draw: Vibo22gDrawingAPI
  sound: Vibo22gSoundAPI
  input: Vibo22gInputAPI
}

export interface Vibo22gGame {
  // Called once when the game starts
  init?(api: Vibo22gAPI): void
  
  // Called every frame (60fps target)
  update(api: Vibo22gAPI, deltaTime: number): void
}