import React, { useState } from 'react'

export default function Slideshow({ images = [] }){
  const [idx, setIdx] = useState(0)
  const n = images.length || 1
  const go = (d) => setIdx((idx + d + n) % n)

  return (
    <div className="slideshow">
      <div style={{aspectRatio:'1/1', background:'#000000ff'}}>
        <img src={images[idx]} alt={`Slide ${idx+1}`} style={{objectFit:'contain', width:'100%', height:'100%'}} />
      </div>
      <div className="slide-controls">
        <button onClick={()=> go(-1)} aria-label="Previous">‹ Prev</button>
        <div style={{opacity:.7}}>{idx+1} / {n}</div>
        <button onClick={()=> go(1)} aria-label="Next">Next ›</button>
      </div>
    </div>
  )
}
