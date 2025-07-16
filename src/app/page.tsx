import Link from 'next/link'
import { getEmulators } from '@/lib/emulators'

export default function Home() {
  const emulators = getEmulators()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Retro Arcade
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Experience classic gaming with our collection of retro emulators. 
            Choose your console and dive into nostalgic adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {emulators.map((emulator) => (
            <Link
              key={emulator.id}
              href={`/${emulator.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/15">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {emulator.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {emulator.name}
                  </h3>
                  <p className="text-blue-200 text-sm mb-4">
                    {emulator.description}
                  </p>
                  <div className="text-xs text-blue-300">
                    {emulator.games.length} game{emulator.games.length !== 1 ? 's' : ''} available
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {emulators.length === 0 && (
          <div className="text-center py-16">
            <p className="text-blue-200 text-lg">No emulators available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
