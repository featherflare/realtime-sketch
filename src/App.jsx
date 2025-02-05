import { useEffect, useRef, useState } from 'react'
import './assets/styles/App.scss'
import Card from './components/Card'
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Draggable)
gsap.registerPlugin(useGSAP)

function App() {
  const canvasRef = useRef()
  const contentRef = useRef()
  const [card, setCard] = useState([])
  const [isCardClicked, setIsCardClicked] = useState(null) // Track if any card has been clicked
  const [clickedCardIndex, setClickedCardIndex] = useState(null) // Track the index of the clicked card
  const tl = useRef()
  const element = useRef()
  const [cardEvent, setCardEvent] = useState(null)
  let particles = [] // Initialize particles array

  const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

  const width = window.innerWidth
  const height = window.innerHeight

  const cardContentMock = [
    { title: 'Card 1', content: 'card card card', file: 'test' },
    { title: 'Card 2', content: 'card card card', file: 'test' },
    {
      title: 'Card 3',
      content: 'card card card card card card card card card card card card',
      file: 'test',
    },
    { title: 'Card 4', content: 'card card card', file: 'test' },
    { title: 'Card 5', content: 'card card card', file: 'test' },
    { title: 'Card 6', content: 'card card card', file: 'test' },
    { title: 'Card 7', content: 'card card card', file: 'test' },
    { title: 'Card 8', content: 'card card card', file: 'test' },
    { title: 'Card 9', content: 'card card card', file: 'test' },
    { title: 'Card 10', content: 'card card card', file: 'test' },
  ]

  useEffect(() => {
    /*** 
     * 
    Card Set Up
     * 
    ***/
    loadCardContent()

    /*** 
     * 
    Canvas Set Up
     * 
    ***/
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

    addEventListener('resize', handleResize)

    // Cleanup event listener on unmount
    return () => {
      removeEventListener('resize', handleResize)
    }
  }, [])

  /*** 
     * 
    Card Set Up
     * 
    ***/

  useEffect(() => {
    cardAnimation()
  }, [card])

  function loadCardContent() {
    // Replace with your own logic to fetch card data
    setCard(cardContentMock)
    // addCard()
  }

  const cardAnimation = () => {
    const content = contentRef.current
    const cardElement = content.querySelectorAll('.card')
    cardElement.forEach((cardE, index) => {
      gsap.fromTo(
        cardE,
        {
          y: '600%',
          x: index % 2 === 0 ? '250%' : '-250%',
          rotate: index % 2 === 0 ? 50 : -50,
          rotateX: -90,
          scale: 2,
          transformOrigin: 'center',
        },
        {
          delay: 0.3 * index,
          y: '-50%',
          x: '-50%',
          rotate: 0,
          rotateX: 0,
          ease: 'power1.inOut',
          duration: 1,
          scale: 1,
          onComplete: () => {
            gsap.to(cardE, {
              x: `${-50 + index}%`,
              y: '-50%',
              onComplete: () => {
                if (index === cardElement.length - 1) {
                  randomLocation()
                }
              },
            })
          },
        }
      )
    })

    function randomLocation() {
      cardElement.forEach((el, index) => {
        gsap.to(el, {
          delay: 0.3 * (cardElement.length - 1 - index),
          x: `${-50 + -127.5 + 127.5 * (index % 3)}%`,
          y: `${-50 + -175 + 80 * (index % 5) - 20 + 30 * Math.random()}%`,
          rotate: Math.random() * (20 - -20) + -20,
          duration: 0.5,
          onComplete: () => {
            setIsCardClicked(true)
            makeDraggable(el, index)
            if (index === 0) {
              randomShowCard() // Trigger when the last animation completes
              startRandomLoop() // Start the loop
            }
          },
        })
      })
    }
  }

  const makeDraggable = (el, index) => {
    Draggable.create(el, {
      type: 'x,y',
      edgeResistance: 0.7,
      bounds: contentRef.current,
      inertia: true,
      onClick: () => {
        element.current = el
        setCardEvent('click')
      },
      onDrag: () => {},
      onDragStart: () => gsap.to(el, { scale: 1.1, duration: 0.2 }),
      onDragEnd: () => {
        gsap.to(el, { scale: 1, duration: 0.2 })
        setCardEvent('drag')
      },
    })
  }

  const cardHandleClick = () => {
    // console.log(cardEvent)
    if (isCardClicked && cardEvent === 'click') {
      tl.current = gsap.timeline().to(element.current, {
        scale: 3,
        duration: 0.5,
        rotate: 0,
        x: '-50%',
        y: '-50%',
      })
      setIsCardClicked(false)
    } else if (!isCardClicked && cardEvent === 'click') {
      tl.current.reversed(!tl.current.reversed())
      setIsCardClicked(true)
    }
  }

  const randomShowCard = () => {
    const content = contentRef.current
    const cardElement = content.querySelectorAll('.card')
    const randomIndex = Math.floor(Math.random() * cardElement.length)

    element.current = cardElement[randomIndex]

    // Find the highest z-index among all cards
    let maxZIndex = 0
    cardElement.forEach((card) => {
      const zIndex = parseInt(card.style.zIndex) || 0
      if (zIndex > maxZIndex) {
        maxZIndex = zIndex
      }
    })

    // Set the selected card's z-index to maxZIndex + 10
    element.current.style.zIndex = maxZIndex + 1

    setCardEvent('click')
  }

  let intervalId

  function startRandomLoop() {
    if (intervalId) clearInterval(intervalId) // Clear existing interval
    intervalId = setInterval(() => {
      randomShowCard()
    }, 5000) // Every 5 seconds
  }

  useEffect(() => {
    console.log('isCardEvent updated:', cardEvent)
    if (cardEvent === 'click') {
      cardHandleClick()
    }
    return setCardEvent('')
  }, [cardEvent])

  useEffect(() => {
    console.log('isCardClicked updated:', isCardClicked)
  }, [isCardClicked])

  useEffect(() => {
    console.log('clickedCardIndex updated:', clickedCardIndex)
  }, [clickedCardIndex])

  // function addCard() {
  //   setCard((prevCards) => [
  //     ...prevCards,
  //     {
  //       title: `Card ${prevCards.length + 1}`,
  //       content: 'New card added',
  //       file: 'test',
  //     },
  //   ])
  // }

  /*** 
     * 
    Canvas Set Up
     * 
    ***/

  // Resize canvas
  const resizeCanvas = (canvas) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  // Animation
  const animate = (ctx, canvas) => {
    ctx.fillStyle = 'rgba(10, 10, 10,1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    particles.forEach((particle) => {
      particle.update(canvas)
    })
    ctx.restore()

    requestAnimationFrame(() => animate(ctx, canvas))
  }

  // Start Function Setup Particles
  function init(ctx, canvas) {
    particles = []
    const particlesCount = 80

    for (let i = 0; i < particlesCount; i++) {
      const x = canvas.width * Math.random() - canvas.width / 2
      const y = canvas.height * Math.random() - canvas.height / 2
      const radius = Math.random() * 2 + 1
      const size = Math.random() * (0.01 * canvas.width) + 0.005 * canvas.width

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

    draw(canvas) {
      this.c.save()
      this.c.translate(canvas.width / 2, canvas.height / 2)
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
      this.draw(canvas)
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
        <div className='cardboard-content' ref={contentRef}>
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
          {card.map((cardData, i) => (
            <Card
              key={i}
              index={i}
              title={cardData.title}
              content={cardData.content}
              file={cardData.file}
              // onClick={(e) => {
              //   cardHandleClick(i)
              // }}
            />
          ))}
        </div>
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
