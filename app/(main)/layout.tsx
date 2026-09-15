// app/(main)/layout.tsx
import React from 'react'
import Header from '../components/Header'
import { getCurrentUser } from '../lib/auth'

async function Homelayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()  // ✅ reads the cookie directly on the server
  return (
    <>
      <Header user={user} />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </>
  )
}

export default Homelayout
