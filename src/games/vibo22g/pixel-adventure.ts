import { Vibo22gGame, Vibo22gAPI } from '@/types'

// Simple demo game showing off the Vibo22g API
class PixelAdventure implements Vibo22gGame {
  private playerX = 50
  private playerY = 20
  private playerVelY = 0
  private time = 0
  private particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = []

  init(api: Vibo22gAPI) {
    // Play a startup chime
    api.sound.playNote(0, 440, 0.2)
    setTimeout(() => api.sound.playNote(1, 523, 0.2), 100)
    setTimeout(() => api.sound.playNote(2, 659, 0.3), 200)
  }

  update(api: Vibo22gAPI, deltaTime: number) {
    this.time += deltaTime

    // Clear screen with a dark blue
    api.draw.clearScreen('#001122')

    // Handle input
    this.handleInput(api)
    
    // Update physics
    this.updatePhysics(deltaTime)
    
    // Update particles
    this.updateParticles(deltaTime)
    
    // Draw game world
    this.drawWorld(api)
    
    // Draw player
    this.drawPlayer(api)
    
    // Draw particles
    this.drawParticles(api)
    
    // Draw UI
    this.drawUI(api)
  }

  private handleInput(api: Vibo22gAPI) {
    const screenWidth = api.draw.getScreenWidth()
    
    // Movement
    if (api.input.getKey('a') || api.input.getKey('arrowleft')) {
      this.playerX = Math.max(0, this.playerX - 2)
    }
    if (api.input.getKey('d') || api.input.getKey('arrowright')) {
      this.playerX = Math.min(screenWidth - 8, this.playerX + 2)
    }
    
    // Jump - check if player is on any platform or ground
    if (api.input.getKey('w') || api.input.getKey('arrowup') || api.input.getKey(' ')) {
      if (this.canJump()) {
        this.playerVelY = -150
        api.sound.playNote(3, 330, 0.1)
      }
    }
  }

  private canJump(): boolean {
    const playerBottom = this.playerY + 8
    const playerLeft = this.playerX
    const playerRight = this.playerX + 8
    
    // Check if on ground
    if (this.playerY >= 70) return true
    
    // Check if on any platform
    // Platform 1: x:30-60, y:70-75 (top at y:70)
    if (playerRight > 30 && playerLeft < 60 && Math.abs(playerBottom - 70) < 2) return true
    
    // Platform 2: x:80-110, y:55-60 (top at y:55)
    if (playerRight > 80 && playerLeft < 110 && Math.abs(playerBottom - 55) < 2) return true
    
    // Platform 3: dynamic width platform (top at y:65)
    const screenWidth = 140 // fallback
    if (playerRight > screenWidth - 50 && playerLeft < screenWidth - 20 && Math.abs(playerBottom - 65) < 2) return true
    
    return false
  }

  private updatePhysics(deltaTime: number) {
    // Force physics to work regardless of deltaTime
    this.playerVelY += 5 // Fixed gravity increment
    
    // Update position
    this.playerY += this.playerVelY * 0.016 // Fixed 60fps deltaTime
    
    // Platform collision detection
    const playerBottom = this.playerY + 8 // Player is 8 pixels tall
    const playerLeft = this.playerX
    const playerRight = this.playerX + 8 // Player is 8 pixels wide
    
    let landed = false
    
    // Check platform collisions only when falling
    if (this.playerVelY > 0) {
      // Platform 1: x:30-60, y:70-75
      if (playerRight > 30 && playerLeft < 60 && playerBottom >= 70 && playerBottom <= 75) {
        this.playerY = 70 - 8
        this.playerVelY = 0
        landed = true
      }
      // Platform 2: x:80-110, y:55-60
      else if (playerRight > 80 && playerLeft < 110 && playerBottom >= 55 && playerBottom <= 60) {
        this.playerY = 55 - 8
        this.playerVelY = 0
        landed = true
      }
      // Platform 3: x:90-120, y:65-70 (fixed width)
      else if (playerRight > 90 && playerLeft < 120 && playerBottom >= 65 && playerBottom <= 70) {
        this.playerY = 65 - 8
        this.playerVelY = 0
        landed = true
      }
      // Ground collision
      else if (this.playerY > 70) {
        this.playerY = 70
        this.playerVelY = 0
        landed = true
      }
    }
    
    if (landed) {
      this.createParticles(this.playerX + 4, this.playerY + 8, 2)
    }
  }

  private updateParticles(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      particle.x += particle.vx * deltaTime * 60
      particle.y += particle.vy * deltaTime * 60
      particle.vy += 10 * deltaTime // gravity
      particle.life -= deltaTime
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  private createParticles(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2 - 1,
        life: 0.5 + Math.random() * 0.5
      })
    }
  }

  private drawWorld(api: Vibo22gAPI) {
    const screenWidth = api.draw.getScreenWidth()
    const screenHeight = api.draw.getScreenHeight()
    
    // Draw ground
    api.draw.drawRect(0, 88, screenWidth, screenHeight, '#228833', true)
    
    // Draw some platforms
    api.draw.drawRect(30, 70, 60, 75, '#555555', true)
    api.draw.drawRect(80, 55, 110, 60, '#555555', true)
    api.draw.drawRect(screenWidth - 50, 65, screenWidth - 20, 70, '#555555', true)
    
    // Draw background elements
    const stars = Math.floor(this.time * 2) % 20
    for (let i = 0; i < stars; i++) {
      const x = (i * 37 + Math.sin(this.time + i) * 10) % screenWidth
      const y = (i * 23) % 40 + 5
      api.draw.drawPixel(x, y, '#ffffff')
    }
  }

  private drawPlayer(api: Vibo22gAPI) {
    // Simple player sprite (8x8 pixels)
    const colors = ['#ff6666', '#ff8888', '#ffaaaa']
    const frame = Math.floor(this.time * 8) % 3
    
    // Body
    api.draw.drawRect(this.playerX + 2, this.playerY + 2, this.playerX + 6, this.playerY + 6, colors[frame], true)
    
    // Head
    api.draw.drawRect(this.playerX + 3, this.playerY, this.playerX + 5, this.playerY + 2, '#ffcccc', true)
    
    // Eyes
    api.draw.drawPixel(this.playerX + 3, this.playerY + 1, '#000000')
    api.draw.drawPixel(this.playerX + 4, this.playerY + 1, '#000000')
    
    // Arms
    api.draw.drawPixel(this.playerX + 1, this.playerY + 3, colors[frame])
    api.draw.drawPixel(this.playerX + 6, this.playerY + 3, colors[frame])
    
    // Legs
    api.draw.drawPixel(this.playerX + 2, this.playerY + 7, colors[frame])
    api.draw.drawPixel(this.playerX + 5, this.playerY + 7, colors[frame])
  }

  private drawParticles(api: Vibo22gAPI) {
    for (const particle of this.particles) {
      const alpha = Math.max(0, particle.life)
      const intensity = Math.floor(alpha * 255)
      const color = `rgb(${intensity}, ${intensity}, ${Math.floor(intensity * 0.5)})`
      api.draw.drawPixel(Math.floor(particle.x), Math.floor(particle.y), color)
    }
  }

  private drawUI(api: Vibo22gAPI) {
    const screenWidth = api.draw.getScreenWidth()
    const screenHeight = api.draw.getScreenHeight()
    
    // Instructions
    this.drawText(api, 'WASD/ARROWS: Move, SPACE: Jump', 2, 2, '#ffffff')
    
    // Player position debug info
    this.drawText(api, `X:${Math.floor(this.playerX)} Y:${Math.floor(this.playerY)} VelY:${this.playerVelY.toFixed(1)}`, Math.max(2, screenWidth - 120), 2, '#888888')
    
    // Screen size debug
    this.drawText(api, `Screen: ${screenWidth}x${screenHeight}`, 2, 10, '#888888')
    
    // Frame counter
    this.drawText(api, `Time: ${this.time.toFixed(1)}s`, 2, screenWidth > 200 ? 18 : screenHeight - 10, '#888888')
  }

  private drawText(api: Vibo22gAPI, text: string, x: number, y: number, color: string) {
    // Simple bitmap font - each character is 4x6 pixels
    const chars: { [key: string]: number[][] } = {
      'A': [[0,1,1,0],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[0,0,0,0]],
      'B': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,1],[1,1,1,0],[0,0,0,0]],
      'C': [[0,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,1],[0,1,1,0],[0,0,0,0]],
      'D': [[1,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,0],[0,0,0,0]],
      'E': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,1,1,1],[0,0,0,0]],
      'F': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]],
      'G': [[0,1,1,1],[1,0,0,0],[1,0,1,1],[1,0,0,1],[0,1,1,1],[0,0,0,0]],
      'H': [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[0,0,0,0]],
      'I': [[1,1,1,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[1,1,1,1],[0,0,0,0]],
      'J': [[1,1,1,1],[0,0,1,0],[0,0,1,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]],
      'K': [[1,0,0,1],[1,0,1,0],[1,1,0,0],[1,0,1,0],[1,0,0,1],[0,0,0,0]],
      'L': [[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,1,1,1],[0,0,0,0]],
      'M': [[1,0,0,1],[1,1,1,1],[1,1,1,1],[1,0,0,1],[1,0,0,1],[0,0,0,0]],
      'N': [[1,0,0,1],[1,1,0,1],[1,1,1,1],[1,0,1,1],[1,0,0,1],[0,0,0,0]],
      'O': [[0,1,1,0],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,0,0,0]],
      'P': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,0],[0,0,0,0]],
      'Q': [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,0,0,1],[0,1,1,1],[0,0,0,0]],
      'R': [[1,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,1,0],[1,0,0,1],[0,0,0,0]],
      'S': [[0,1,1,1],[1,0,0,0],[0,1,1,0],[0,0,0,1],[1,1,1,0],[0,0,0,0]],
      'T': [[1,1,1,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      'U': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,0,0,0]],
      'V': [[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      'W': [[1,0,0,1],[1,0,0,1],[1,1,1,1],[1,1,1,1],[1,0,0,1],[0,0,0,0]],
      'X': [[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[1,0,0,1],[0,0,0,0]],
      'Y': [[1,0,0,1],[1,0,0,1],[0,1,1,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
      'Z': [[1,1,1,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1],[0,0,0,0]],
      '0': [[0,1,1,0],[1,0,0,1],[1,0,1,1],[1,1,0,1],[0,1,1,0],[0,0,0,0]],
      '1': [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,1,0,0],[1,1,1,0],[0,0,0,0]],
      '2': [[0,1,1,0],[1,0,0,1],[0,0,1,0],[0,1,0,0],[1,1,1,1],[0,0,0,0]],
      '3': [[1,1,1,0],[0,0,0,1],[0,1,1,0],[0,0,0,1],[1,1,1,0],[0,0,0,0]],
      '4': [[1,0,1,0],[1,0,1,0],[1,1,1,1],[0,0,1,0],[0,0,1,0],[0,0,0,0]],
      '5': [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,1,1,0],[0,0,0,0]],
      '6': [[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,0,1],[0,1,1,0],[0,0,0,0]],
      '7': [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[0,0,0,0]],
      '8': [[0,1,1,0],[1,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,0,0,0]],
      '9': [[0,1,1,0],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,1,1,0],[0,0,0,0]],
      ' ': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      ':': [[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
      '.': [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,0,0,0]],
      '/': [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[0,0,0,0],[0,0,0,0]],
    }

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase()
      const pattern = chars[char]
      if (pattern) {
        for (let row = 0; row < pattern.length; row++) {
          for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
              api.draw.drawPixel(x + i * 5 + col, y + row, color)
            }
          }
        }
      }
    }
  }
}

const pixelAdventureGame = new PixelAdventure()
export default pixelAdventureGame