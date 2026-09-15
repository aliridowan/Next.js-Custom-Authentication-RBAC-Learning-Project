'use client'
import React from 'react'
import { User } from '../api/types'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../providers/authContext'

interface HeaderProps {
  user: User | null
}

function Header({ user }: HeaderProps) {
  const { logout } = useAuth()
  const pathName = usePathname()
  // const user = true
  const navigation = [

    { name: 'Home', href: '/', show: true },
    { name: 'Dashboard', href: '/dashboard', show: true }
  ].filter((item) => (item.show))

  return (
    <header className='bg-slate-900 border-b border-slate-700'>

      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* logo */}
          <Link href='/' className='font-bold text-white text-xl'>TeamAccess</Link>

          {/* navigation */}
          <nav className='flex items-center space-x-6'>
            {navigation.map((item) => (
              <Link className='text-rose-400' href={item.href} key={item.name}>{item.name}</Link>
            ))}
          </nav>
          <div className='flex items-center space-x-4'> {user ? <>
            <span className='text-slate-300'>{user?.name}</span>
            <button onClick={logout} className='text-red-600 cursor-pointer'>Logout</button>
          </> : <>

            <Link href='/login' className='px-4 text-green-300'>Login</Link>
            <Link href='/register' className='px-4 text-blue-400'>Register</Link>
          </>}</div>
        </div>
      </div>

    </header>
  )
}

export default Header
