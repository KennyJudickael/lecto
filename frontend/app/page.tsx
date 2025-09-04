'use client' // obligatoire pour useState/useEffect côté client
import { useEffect, useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Error fetching API:', err))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Frontend Next.js + TS</h1>
      <p className="text-xl">{message || 'Loading...'}</p>
    </div>
  )
}
