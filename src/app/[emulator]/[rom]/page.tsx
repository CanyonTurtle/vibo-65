import { notFound } from 'next/navigation'
import EmulatorContainer from '@/components/emulator/EmulatorContainer'
import { getEmulator } from '@/lib/emulators'
import { getGame } from '@/lib/games'

interface GamePageProps {
  params: {
    emulator: string
    rom: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { emulator, rom } = params
  
  const emulatorConfig = await getEmulator(emulator)
  const gameConfig = await getGame(emulator, rom)
  
  if (!emulatorConfig || !gameConfig) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-black">
      <EmulatorContainer 
        emulator={emulatorConfig}
        game={gameConfig}
      />
    </div>
  )
}

export async function generateStaticParams() {
  // This will be populated with available emulator/rom combinations
  return []
}