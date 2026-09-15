'use client'
import { useActionState } from "react"
import { apiClient } from "../../lib/apiClient"
import Link from "next/link"
import { useRouter } from "next/navigation"

export type LoginState = {
  error?: string,
  success?: boolean
}
function LoginPage() {
  const router = useRouter()
  const [state, loginAction, isPending] = useActionState(
    async (previousState: LoginState, formData: FormData): Promise<LoginState> => {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      try {
        await apiClient.login(
          email,
          password,
        );
        router.push('/dashboard')
        return { success: true }
      } catch (error) {

        return {
          error: error instanceof Error ? error.message : 'Login Failed'
        }
      }
    },
    { error: undefined, success: undefined }
  )
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Sign in into your account</h2>
          <p className="text-slate-400 mt-1 text-sm">Join your team on TeamAccess</p>
        </div>

        {/* Error message */}
        {state?.error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
            {state.error}
          </div>
        )}

        <form action={loginAction} className="space-y-5">


          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>


          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition mt-2"
          >
            {isPending ? 'Loggin in...' : 'Login into account'}
          </button>

        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-green-400 hover:text-green-300 transition">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage
