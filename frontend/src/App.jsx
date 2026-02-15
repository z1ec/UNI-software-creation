import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message ?? 'No message'))
      .catch(() => setMessage('Failed to load'))
  }, [])

  return (
    <>
      <h1>API Message</h1>
      <p>{message}</p>
    </>
  )
}

export default App
