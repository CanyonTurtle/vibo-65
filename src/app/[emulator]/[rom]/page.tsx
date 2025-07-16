import Link from 'next/link'
import { notFound } from 'next/navigation'
import EmulatorContainer from '@/components/emulator/EmulatorContainer'
import { getEmulator, getEmulators } from '@/lib/emulators'
import { getGame } from '@/lib/games'

interface GamePageProps {
  params: {
    emulator: string
    rom: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { emulator, rom } = await params
  
  const emulatorConfig = getEmulator(emulator)
  const gameConfig = getGame(emulator, rom)
  
  if (!emulatorConfig || !gameConfig) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-10">
        <Link 
          href={`/${emulator}`}
          className="inline-flex items-center bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors"
        >
          ← Back to {emulatorConfig.name}
        </Link>
      </div>
      <EmulatorContainer 
        emulator={emulatorConfig}
        game={gameConfig}
      />
    </div>
  )
}

export async function generateStaticParams() {
  const emulators = getEmulators()
  const params: { emulator: string; rom: string }[] = []
  
  emulators.forEach(emulator => {
    emulator.games.forEach(game => {
      params.push({
        emulator: emulator.id,
        rom: game.id
      })
    })
  })
  
  return params
}