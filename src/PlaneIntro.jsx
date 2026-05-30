import { useState, useEffect, useRef } from 'react'
import styles from './PlaneIntro.module.css'

const sleep = ms => new Promise(r => setTimeout(r, ms))
const W = 320
const H = 480
function randInt(a, b) { return Math.floor(Math.random() * (b - a)) + a }

// ── AUDIO ENGINE ──────────────────────────────────────────────
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.18
    this.masterGain.connect(this.ctx.destination)
    this.bgStarted = false
  }

  _osc(freq, type, duration, vol = 0.3, startFreq = null) {
    const ctx = this.ctx
    const g = ctx.createGain()
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    g.connect(this.masterGain)
    const o = ctx.createOscillator()
    o.type = type
    if (startFreq) {
      o.frequency.setValueAtTime(startFreq, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + duration * 0.3)
    } else {
      o.frequency.setValueAtTime(freq, ctx.currentTime)
    }
    o.connect(g)
    o.start(ctx.currentTime)
    o.stop(ctx.currentTime + duration)
  }

  shoot() {
    this._osc(880, 'square', 0.08, 0.15, 1200)
  }

  explosion(big = false) {
    const ctx = this.ctx
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const src = ctx.createBufferSource()
    src.buffer = buf
    const g = ctx.createGain()
    g.gain.setValueAtTime(big ? 0.6 : 0.35, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (big ? 0.5 : 0.25))
    src.connect(g)
    g.connect(this.masterGain)
    src.start()
    if (big) this._osc(60, 'sine', 0.5, 0.4)
  }

  score() {
    this._osc(660, 'square', 0.06, 0.12)
    setTimeout(() => this._osc(880, 'square', 0.06, 0.12), 60)
  }

  startBg() {
    if (this.bgStarted) return
    this.bgStarted = true
    const notes = [220, 247, 262, 294, 330, 294, 262, 247]
    let i = 0
    const play = () => {
      if (!this.bgStarted) return
      this._osc(notes[i % notes.length], 'square', 0.13, 0.06)
      this._osc(notes[i % notes.length] * 2, 'square', 0.13, 0.03)
      i++
      this.bgTimer = setTimeout(play, 140)
    }
    play()
  }

  stopBg() {
    this.bgStarted = false
    clearTimeout(this.bgTimer)
  }

  victory() {
    const v = [523, 659, 784, 1047]
    v.forEach((f, i) => setTimeout(() => this._osc(f, 'square', 0.18, 0.2), i * 120))
  }
}

// ── DIBUJO ────────────────────────────────────────────────────
function drawPixelPlane(ctx, x, y, color = '#CC1A1A') {
  const p = [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,0,1,0,1,1],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
    [0,0,1,0,1,0,0],
  ]
  const sz = 4
  p.forEach((row, ry) => row.forEach((cell, rx) => {
    if (cell) { ctx.fillStyle = color; ctx.fillRect(x + rx*sz, y + ry*sz, sz, sz) }
  }))
  ctx.fillStyle = '#ffcc00'
  ctx.fillRect(x + 3*sz, y + sz, sz, sz)
}

function drawPixelEnemy(ctx, x, y, type = 0) {
  const patterns = [
    [[0,1,0,0,0,1,0],[1,1,1,1,1,1,1],[0,1,1,1,1,1,0],[1,0,1,1,1,0,1],[0,0,0,1,0,0,0]],
    [[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[0,1,1,1,1,1,0],[0,0,1,0,1,0,0]],
    [[1,0,0,1,0,0,1],[0,1,1,1,1,1,0],[1,1,1,1,1,1,1],[0,1,0,1,0,1,0],[0,0,1,0,1,0,0]],
  ]
  const p = patterns[type % patterns.length]
  const sz = 4
  ctx.fillStyle = type === 0 ? '#666' : type === 1 ? '#884400' : '#446688'
  p.forEach((row, ry) => row.forEach((cell, rx) => {
    if (cell) ctx.fillRect(x + rx*sz, y + ry*sz, sz, sz)
  }))
}

function drawBoss(ctx, x, y) {
  const p = [
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
  ]
  const sz = 4
  ctx.fillStyle = '#CC1A1A'
  p.forEach((row, ry) => row.forEach((cell, rx) => {
    if (cell) ctx.fillRect(x + rx*sz, y + ry*sz, sz, sz)
  }))
  ctx.fillStyle = '#ff4400'
  ctx.fillRect(x + 4*sz, y + 2*sz, sz*2, sz*2)
}

function createExplosion(x, y, big = false) {
  const colors = ['#CC1A1A','#ff4400','#ffcc00','#fff','#ff8800','#ff2200']
  return {
    x, y, life: 1, big,
    particles: Array.from({ length: big ? 20 : 10 }, () => ({
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      size: randInt(big ? 4 : 2, big ? 9 : 6),
      color: colors[randInt(0, colors.length)],
    }))
  }
}

function drawExplosion(ctx, ex) {
  const progress = 1 - ex.life
  ex.particles.forEach(p => {
    ctx.globalAlpha = ex.life * 0.95
    ctx.fillStyle = p.color
    ctx.fillRect(ex.x + p.dx * progress * 50, ex.y + p.dy * progress * 50, p.size, p.size)
  })
  ctx.globalAlpha = 1
}

// ── COMPONENTE ────────────────────────────────────────────────
export default function PlaneIntro({ onComplete }) {
  const canvasRef = useRef(null)
  const [screen, setScreen] = useState('insert') // insert | game
  const [hide, setHide] = useState(false)
  const [blink, setBlink] = useState(true)
  const audioRef = useRef(null)
  const cancelled = useRef(false)

  // Blink del INSERT COIN
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 520)
    return () => clearInterval(t)
  }, [])

  function startGame() {
    audioRef.current = new AudioEngine()
    setScreen('game')
  }

  useEffect(() => {
    if (screen !== 'game') return
    const audio = audioRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let lastTime = 0
    let rafId

    audio.startBg()

    const s = {
      phase: 'game',
      player: { x: W/2 - 14, y: H - 80 },
      bullets: [],
      enemyBullets: [],
      enemies: [],
      explosions: [],
      score: 1800,
      frame: 0,
      boss: null,
      bossSpawned: false,
      done: false,
      yearAlpha: 0,
      logoAlpha: 0,
      flashAlpha: 0,
      stars: Array.from({ length: 70 }, () => ({
        x: randInt(0, W), y: randInt(0, H),
        speed: Math.random() * 1.8 + 0.4,
        size: Math.random() < 0.15 ? 2 : 1,
      })),
      powerups: [],
      wave: 0,
    }

    let shootCooldown = 0
    let scoreSoundCooldown = 0

    function spawnWave() {
      s.wave++
      const count = Math.min(3 + s.wave, 7)
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (cancelled.current) return
          s.enemies.push({
            x: randInt(10, W - 38),
            y: -30 - i * 20,
            speed: Math.random() * 1.4 + 0.9,
            hp: s.wave > 3 ? 2 : 1,
            type: randInt(0, 3),
            shootTimer: randInt(60, 180),
            wobble: Math.random() * Math.PI * 2,
          })
        }, i * 120)
      }
    }

    function tick(ts) {
      if (cancelled.current) return
      const dt = Math.min(ts - lastTime, 32)
      lastTime = ts
      s.frame++
      shootCooldown--
      scoreSoundCooldown--

      // Fondo
      ctx.fillStyle = '#04040a'
      ctx.fillRect(0, 0, W, H)

      // Estrellas
      s.stars.forEach(st => {
        st.y += st.speed * (dt/16)
        if (st.y > H) { st.y = -2; st.x = randInt(0, W) }
        ctx.fillStyle = `rgba(255,255,255,${0.15 + st.size * 0.25})`
        ctx.fillRect(Math.floor(st.x), Math.floor(st.y), st.size, st.size)
      })

      if (s.phase === 'game') {
        // Spawn waves
        if (s.enemies.length === 0 && !s.bossSpawned) spawnWave()

        // Boss a los 1930
        if (s.score >= 1920 && !s.bossSpawned) {
          s.bossSpawned = true
          s.enemies = []
          s.boss = { x: W/2 - 20, y: -60, hp: 5, dir: 1, speed: 1.4, shootTimer: 35 }
        }

        // Jugador oscila
        s.player.x = W/2 - 14 + Math.sin(s.frame / 35) * 85 + Math.sin(s.frame / 17) * 25

        // Auto-disparo
        if (shootCooldown <= 0) {
          shootCooldown = 10
          s.bullets.push({ x: s.player.x + 10, y: s.player.y - 6, vy: -8 })
          s.bullets.push({ x: s.player.x + 2,  y: s.player.y - 6, vy: -8 })
          if (s.score > 1870) s.bullets.push({ x: s.player.x + 6, y: s.player.y - 10, vy: -9 })
          audio.shoot()
        }

        // Mover balas jugador
        s.bullets = s.bullets.filter(b => b.y > -10)
        s.bullets.forEach(b => {
          b.y += b.vy * (dt/16)
          ctx.fillStyle = '#ffcc00'
          ctx.fillRect(b.x, b.y, 3, 9)
          ctx.fillStyle = 'rgba(255,200,0,0.3)'
          ctx.fillRect(b.x, b.y + 9, 3, 5)
        })

        // Mover balas enemigas
        s.enemyBullets = s.enemyBullets.filter(b => b.y < H + 10)
        s.enemyBullets.forEach(b => {
          b.x += b.vx * (dt/16)
          b.y += b.vy * (dt/16)
          ctx.fillStyle = '#ff4444'
          ctx.fillRect(b.x, b.y, 4, 4)
        })

        // Mover y dibujar enemigos
        s.enemies.forEach(e => {
          e.y += e.speed * (dt/16)
          e.wobble += 0.04
          e.x += Math.sin(e.wobble) * 0.8
          e.shootTimer--
          if (e.shootTimer <= 0 && e.y > 0) {
            e.shootTimer = randInt(80, 160)
            s.enemyBullets.push({ x: e.x + 14, y: e.y + 20, vx: 0, vy: 3 })
          }
          drawPixelEnemy(ctx, e.x, e.y, e.type)
        })
        s.enemies = s.enemies.filter(e => e.y < H + 30)

        // Boss
        if (s.boss) {
          const b = s.boss
          b.y = Math.min(b.y + 0.6 * (dt/16), 30)
          b.x += b.dir * b.speed * (dt/16)
          if (b.x > W - 45 || b.x < 5) b.dir *= -1
          b.shootTimer--
          if (b.shootTimer <= 0) {
            b.shootTimer = 28
            const angles = [-0.3, 0, 0.3]
            angles.forEach(a => {
              s.enemyBullets.push({ x: b.x + 20, y: b.y + 30, vx: Math.sin(a) * 3, vy: Math.cos(a) * 3 })
            })
          }
          drawBoss(ctx, b.x, b.y)
          // HP bar del boss
          ctx.fillStyle = 'rgba(0,0,0,0.5)'
          ctx.fillRect(60, H - 18, W - 120, 8)
          ctx.fillStyle = '#CC1A1A'
          ctx.fillRect(60, H - 18, (W - 120) * (b.hp / 8), 8)
          ctx.fillStyle = '#fff'
          ctx.font = '8px monospace'
          ctx.textAlign = 'center'
          ctx.fillText('BOSS', W/2, H - 22)
        }

        // Colisiones balas-enemigos
        s.bullets.forEach(b => {
          s.enemies.forEach(e => {
            if (b.y > e.y && b.y < e.y + 20 && b.x > e.x && b.x < e.x + 28) {
              e.hp--
              b.y = -999
              if (e.hp <= 0) {
                s.explosions.push(createExplosion(e.x + 14, e.y + 10))
                audio.explosion()
                const gain = randInt(8, 18)
                s.score = Math.min(s.score + gain, 1942)
                if (scoreSoundCooldown <= 0) { audio.score(); scoreSoundCooldown = 8 }
              }
            }
          })
          // Balas-boss
          if (s.boss) {
            const bx = s.boss
            if (b.y > bx.y && b.y < bx.y + 28 && b.x > bx.x && b.x < bx.x + 40) {
              bx.hp--
              b.y = -999
              s.explosions.push(createExplosion(bx.x + randInt(5,35), bx.y + randInt(5,20)))
              audio.explosion()
              s.score = Math.min(s.score + 2, 1942)
              if (bx.hp <= 0) {
                // Boss muerto — llegar a 1943
                for (let i = 0; i < 8; i++) {
                  setTimeout(() => {
                    if (!cancelled.current) s.explosions.push(createExplosion(bx.x + randInt(0,40), bx.y + randInt(0,30), true))
                  }, i * 100)
                }
                audio.explosion(true)
                s.boss = null
                setTimeout(() => { if (!cancelled.current) s.score = 1943 }, 500)
              }
            }
          }
        })
        s.enemies = s.enemies.filter(e => e.hp > 0)

        // Jugador
        drawPixelPlane(ctx, s.player.x, s.player.y)

        // HUD
        ctx.fillStyle = '#ffcc00'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'left'
        ctx.fillText(`SCORE  ${String(s.score).padStart(6,'0')}`, 8, 18)
        ctx.fillStyle = '#CC1A1A'
        ctx.textAlign = 'right'
        ctx.fillText('1UP  ♥♥♥', W - 8, 18)
        ctx.textAlign = 'left'

        // Línea divisoria HUD
        ctx.fillStyle = 'rgba(204,26,26,0.3)'
        ctx.fillRect(0, 22, W, 1)

        // Tiempo máximo: si a los 480 frames no llegó a 1943, forzar
        if (s.frame > 480 && s.score < 1943) s.score = 1943

        // Score llega a 1943
        if (s.score >= 1943) {
          s.phase = 'exploding'
          s.explodingFrame = s.frame
          audio.stopBg()
          audio.victory()
          s.score = 1943
          for (let i = 0; i < 16; i++) {
            setTimeout(() => {
              if (!cancelled.current) {
                s.explosions.push(createExplosion(randInt(20, W-20), randInt(30, H-80), i % 3 === 0))
                if (i % 2 === 0) audio.explosion(i % 4 === 0)
              }
            }, i * 90)
          }
        }
      } else if (s.phase === 'exploding') {
        // Jugador sigue visible con glitch
        if (s.frame % 6 < 4) drawPixelPlane(ctx, s.player.x, s.player.y)
        ctx.fillStyle = '#ffcc00'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'left'
        ctx.fillText('SCORE  001943', 8, 18)

        // Después de 1.8s de explosiones, pasar a fadeout
        if (s.frame - s.explodingFrame > 108) {
          s.phase = 'fadeout'
        }
      } else if (s.phase === 'fadeout') {
        s.flashAlpha = Math.min(s.flashAlpha + 0.035, 1)
        ctx.fillStyle = `rgba(8,8,8,${s.flashAlpha})`
        ctx.fillRect(0, 0, W, H)
        if (s.flashAlpha >= 1) {
          s.phase = 'year'
        }
      } else if (s.phase === 'year') {
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, W, H)
        s.yearAlpha = Math.min(s.yearAlpha + 0.025, 1)
        ctx.save()
        ctx.globalAlpha = s.yearAlpha
        ctx.fillStyle = '#f0ede8'
        ctx.font = `bold ${Math.floor(W * 0.28)}px 'Bebas Neue', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('1943', W/2, H/2 + 40)
        ctx.restore()
        if (s.yearAlpha >= 1 && !s.done) {
          s.done = true
          s.phase = 'done'
          setTimeout(async () => {
            if (cancelled.current) return
            setHide(true)
            await sleep(700)
            if (!cancelled.current) onComplete()
          }, 1200)
        }
      } else if (s.phase === 'done') {
        ctx.fillStyle = '#080808'
        ctx.fillRect(0, 0, W, H)
        ctx.save()
        ctx.globalAlpha = 1
        ctx.fillStyle = '#f0ede8'
        ctx.font = `bold ${Math.floor(W * 0.28)}px 'Bebas Neue', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('1943', W/2, H/2 + 40)
        ctx.restore()
      }

      // Explosiones
      s.explosions.forEach(ex => {
        ex.life -= 0.028 * (dt/16)
        drawExplosion(ctx, ex)
      })
      s.explosions = s.explosions.filter(ex => ex.life > 0)

      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.09)'
      for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2)

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(t => { lastTime = t; tick(t) })
    return () => {
      cancelled.current = true
      audio.stopBg()
      cancelAnimationFrame(rafId)
    }
  }, [screen])

  if (screen === 'insert') {
    return (
      <div className={`${styles.stage} ${hide ? styles.hide : ''}`}>
        <div className={styles.crt}>
          <div className={styles.insertScreen}>
            <div className={styles.insertLogo}>1943</div>
            <div className={styles.insertSub}>EZPELETA RECORDS</div>
            <div className={styles.insertDivider} />
            <div className={`${styles.insertCoin} ${blink ? styles.visible : styles.invisible}`}>
              — INSERT COIN —
            </div>
            <button className={styles.insertBtn} onClick={startGame}>
              PRESS START
            </button>
            <div className={styles.insertCopy}>© 1994 EZPELETA RECORDS</div>
          </div>
        </div>
        <button className={styles.skip} onClick={() => { cancelled.current = true; onComplete() }}>
          skip →
        </button>
      </div>
    )
  }

  return (
    <div className={`${styles.stage} ${hide ? styles.hide : ''}`}>
      <div className={styles.scanlines} />
      <div className={styles.crt}>
        <canvas ref={canvasRef} width={W} height={H} className={styles.canvas} />
      </div>
      <button className={styles.skip} onClick={() => { cancelled.current = true; onComplete() }}>
        skip →
      </button>
    </div>
  )
}
