import { useEffect, useRef, useState } from 'react'
import './assets/styles/App.scss'

function App() {
  const canvasRef = useRef()
  let particles

  const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

  const width = window.innerWidth
  const height = window.innerHeight

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    resizeCanvas(canvas)
    init(ctx, canvas)
    animate(ctx, canvas)

    // Handle resize event
    const handleResize = () => {
      resizeCanvas(canvas)
      init(ctx, canvas)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const resizeCanvas = (canvas) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const animate = (ctx, canvas) => {
    var opacity = 1
    ctx.save()
    ctx.fillStyle = 'rgba(10, 10, 10,1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(() => animate(ctx, canvas))

    ctx.translate(canvas.width / 2, canvas.height / 2)
    particles.forEach((particle) => {
      particle.update(canvas)
    })

    ctx.restore()
  }

  function init(ctx, canvas) {
    particles = []

    const particlesCount = 80

    for (let i = 0; i < particlesCount; i++) {
      const x = canvas.width * Math.random() - canvas.width / 2
      const y = canvas.height * Math.random() - canvas.height / 2
      const radius = Math.random() * 2 + 1
      const size = Math.random() * 5 + 3

      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(
        new Particle(ctx, x, y, size, radius, color, {
          x:
            Math.random() *
            Math.cos(Math.random() * 10 + 1) *
            Math.sin(Math.random() * 10 + 1),
          y:
            Math.random() *
            Math.sin(Math.random() * 10 + 1) *
            Math.cos(Math.random() * 10 + 1),
        })
      )
    }
  }

  // Objects
  class Particle {
    constructor(c, x, y, size, radius, color, velocity) {
      this.x = x
      this.y = y
      this.radius = radius
      this.color = color
      this.velocity = velocity
      this.c = c
      this.size = size
    }

    draw() {
      this.c.save()
      this.c.beginPath()
      // this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)

      this.c.moveTo(this.x, this.y + this.size / 2)
      this.c.lineTo(this.x + this.size / 2, this.y)
      this.c.quadraticCurveTo(
        this.x + 3 * (this.size / 4),
        this.y - this.size / 4,
        this.x + this.size / 2,
        this.y - this.size / 2
      )
      this.c.quadraticCurveTo(
        this.x + this.size / 4,
        this.y - 3 * (this.size / 4),
        this.x,
        this.y - this.size / 2
      )
      this.c.quadraticCurveTo(
        this.x - this.size / 4,
        this.y - 3 * (this.size / 4),
        this.x - this.size / 2,
        this.y - this.size / 2
      )
      this.c.quadraticCurveTo(
        this.x - 3 * (this.size / 4),
        this.y - this.size / 4,
        this.x - this.size / 2,
        this.y
      )

      this.c.shadowColor = this.color
      this.c.shadowBlur = 15
      this.c.shadowOffsetX = 0
      this.c.shadowOffsetY = 0
      this.c.fillStyle = this.color
      this.c.fill()
      this.c.closePath()
      this.c.restore()
    }

    update(canvas) {
      this.draw()
      this.x += this.velocity.x
      this.y += this.velocity.y
      if (
        this.x + this.size > canvas.width / 2 ||
        this.x - this.size < -canvas.width / 2
      ) {
        this.velocity.x = -this.velocity.x
      }
      if (
        this.y + this.size > canvas.height / 2 ||
        this.y - this.size < -canvas.height / 2
      ) {
        this.velocity.y = -this.velocity.y
      }
    }
  }

  return (
    <>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <div className='cardboard'>
        <svg>
          <defs>
            <pattern
              id='dashedPattern'
              width='30'
              height='30'
              patternUnits='userSpaceOnUse'
            >
              <path
                d='M0.5 30V0.5H30'
                fill='none'
                stroke='black'
                strokeWidth='1'
                strokeDasharray='4 2'
              />
            </pattern>
          </defs>
          <rect fill='url(#dashedPattern)' />
        </svg>
        <div className='cardboard-header'>
          <div className='cardboard-event-name'>Project Name</div>
          <div className='cardboard-user-online'>
            <div className='cardboard-point'>
              <span className='cardboard-point-outer'></span>
              <span className='cardboard-point-inner'></span>
            </div>
            <div>1</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
