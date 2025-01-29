import { useEffect, useRef, useState } from 'react'
import './assets/styles/App.scss'

function App() {
  const canvasRef = useRef()

  useEffect(() => {
    console.log('test')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const drawCircle = (x, y, radius) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      drawCircle(width / 2, height / 2, 100)

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <>
      <div></div>
      <div>
        <canvas ref={canvasRef} />
      </div>
    </>
  )
}

export default App
