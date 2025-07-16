import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEmulator, getEmulators } from '@/lib/emulators'

interface EmulatorPageProps {
  params: Promise<{
    emulator: string
  }>
}

export default async function EmulatorPage({ params }: EmulatorPageProps) {
  const { emulator: emulatorId } = await params
  const emulator = getEmulator(emulatorId)

  if (!emulator) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-200 hover:text-white transition-colors"
          >
            ← Back to Emulators
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-violet-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {emulator.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {emulator.name}
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-4">
            {emulator.description}
          </p>
          <div className="text-sm text-blue-300 mb-2">
            By {emulator.author} • Released {new Date(emulator.date).toLocaleDateString()}
          </div>
          <div className="text-sm text-blue-300">
            Screen Resolution: {emulator.screenWidth} × {emulator.screenHeight}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Available Games
          </h2>
          
          {emulator.games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emulator.games.map((game) => (
                <Link
                  key={game.id}
                  href={`/${emulator.id}/${game.id}`}
                  className="group"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/15">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {game.title.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {game.title}
                      </h3>
                      <p className="text-blue-200 text-sm mb-2">
                        {game.description}
                      </p>
                      <div className="text-xs text-blue-300 mb-3">
                        By {game.author} • {new Date(game.date).toLocaleDateString()}
                      </div>
                      <div className="mt-4">
                        <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                          Play Now
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-blue-200 text-lg">No games available for this emulator yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const emulators = getEmulators()
  
  return emulators.map((emulator) => ({
    emulator: emulator.id
  }))
}