import { useEffect, useState } from 'react'
import './App.css'

type HelloResponse = {
  message: string
}

function App() {
  const [data, setData] = useState<HelloResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/hello')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        return (await response.json()) as HelloResponse
      })
      .then((json) => setData(json))
      .catch((err: Error) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>Frontend in Docker</h1>
      {error && <p>Ошибка: {error}</p>}
      {!error && !data && <p>Загрузка...</p>}
      {data && <p>Ответ backend: {data.message}</p>}
    </main>
  )
}

export default App
