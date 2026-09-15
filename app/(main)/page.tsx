'use client'
import Link from 'next/link'
import { useAuth } from '../providers/authContext'

const features = [
  'Role-based access control (RBAC)',
  'Route protection with middleware',
  'Server-side permission checks',
  'Client-side permission hooks',
  'Dynamic route access',
]

const roles = [
  { label: 'Super Admin', color: 'text-yellow-400', desc: 'Full system access' },
  { label: 'Admin', color: 'text-red-400', desc: 'User & team management' },
  { label: 'Manager', color: 'text-purple-400', desc: 'Team specific management' },
  { label: 'User', color: 'text-blue-400', desc: 'Basic dashboard' },
]

function HomePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Access Control Demo</h1>
        <p className="text-slate-400">
          This demo showcases Next.js 16 access control features with role-based permissions.
        </p>
      </div>

      {/* Feature + Roles cards */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Features */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Features Demonstrated</h2>
          <ul className="space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-green-400 mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Roles */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">User Roles</h2>
          <ul className="space-y-3">
            {roles.map((r) => (
              <li key={r.label} className="text-sm">
                <span className={`font-semibold ${r.color}`}>{r.label}: </span>
                <span className="text-slate-300">{r.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Auth state banner */}
      {user ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-300 mb-4">
            You are logged in as{' '}
            <span className="text-white font-semibold">{user.name}</span>
            {' '}with role{' '}
            <span className="text-blue-400 font-semibold">{user.role}</span>.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
          <p className="text-slate-300 mb-4">You are not logged in.</p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
            >
              Register
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePage


// 'use client'

// import Link from 'next/link'
// import React from 'react'
//
// function HomePage() {
//   const user = false
//   return (
//     <div className='max-w-4xl mx-auto'>
//       <h1 className='text-3xl font-bold mb-6 text-white'>TEAM ACCESS CONTROL DEMO</h1>
//       <p className='text-slate-300 mb-6'> This is a demo application </p>
//
//       <div className='grid md: grid-cols-2 gap-6 mb-8 '></div>
//
//       {user ? <div className='bg-green-900/30 border-green-50'>
//         <p className='text-green-300'> Welcome Back , <strong>NOTHING!</strong> you are logged in as {""} <strong className='text-gray-200'> User</strong> </p>
//         <p> You are logged in </p>
//         <Link href='/dashboard'>Go to dashboard</Link>
//       </div> :
//
//         <div>
//           <div className='text-slate-300 mb-6'>
//             You are not logged in
//             <Link href='/login' className='px-4 text-green-300'>Login</Link>
//             <Link href='/register' className='px-4 text-blue-400'>Register</Link>
//           </div>
//
//         </div>}
//     </div>
//   )
//
// }
//
// export default HomePage
