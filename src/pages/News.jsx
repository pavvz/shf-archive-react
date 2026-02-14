import React, { useEffect, useState } from 'react'
import Slideshow from '../components/Slideshow'

const KEY = 'news-posts-v1'

export default function News() {
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [images, setImages] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(posts)) }, [posts])

  const createPost = (e) => {
    e.preventDefault()
    const imgs = images.split(',').map(s => s.trim()).filter(Boolean)
    setPosts([{
      id: Date.now().toString(),
      title: title || 'Untitled',
      date: date || new Date().toISOString(),
      images: imgs,
      body
    }, ...posts])
    setTitle(''); setDate(''); setImages(''); setBody('')
  }

  const removePost = (id) => setPosts(posts.filter(p => p.id !== id))

  return (
    <section>
      <h1>News</h1>
      <form className="news-compose" onSubmit={createPost}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY-MM-DD or leave blank for today" />
        </div>
        <input value={images} onChange={e => setImages(e.target.value)} placeholder="Image URLs (comma separated)" />
        <textarea rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your announcement..." />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="submit" className="badge" style={{ cursor: 'pointer' }}>Publish</button>
        </div>
      </form>

      <div style={{ height: 12 }} />
      {posts.map(p => (
        <article key={p.id} className="news-post">
          <h3>{p.title}</h3>
          <div className="meta">{new Date(p.date).toLocaleString()}</div>
          {p.images && p.images.length > 0 && (
            <div className="slide">
              <Slideshow images={p.images} />
            </div>
          )}
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{p.body}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="badge" onClick={() => removePost(p.id)} style={{ cursor: 'pointer' }}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  )
}
