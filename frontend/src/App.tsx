import { useEffect, useState } from 'react'

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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Frontend in Docker</h1>
        {error && <p className="text-red-600">Ошибка: {error}</p>}
        {!error && !data && <p className="text-slate-600">Загрузка...</p>}
        {data && <p className="text-slate-700">Ответ backend: {data.message}</p>}
      </section>
    </main>
  )
}

export default App
