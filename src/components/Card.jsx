import { useEffect, useRef, useState } from 'react'
import '../assets/styles/Card.scss'

function Card({ index, title, content, file }) {
  return (
    <>
      <div className='card' key={index} id={`card-${index}`}>
        <div className='card-media'></div>
        <h3 className='card-title'>{title}</h3>
        <p className='card-content'>{content}</p>
      </div>
    </>
  )
}

export default Card
