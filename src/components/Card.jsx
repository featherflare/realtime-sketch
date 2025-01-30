import { useEffect, useRef, useState } from 'react'
import '../assets/styles/Card.scss'

function Card({ index, title, content, file, onClick }) {
  return (
    <>
      <div className='card' id={`card-${index}`} onClick={() => onClick()}>
        <div className='card-media'></div>
        <h3 className='card-title'>{title}</h3>
        <p className='card-content'>{content}</p>
      </div>
    </>
  )
}

export default Card
