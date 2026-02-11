'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/ui/AuthCard'
import { Navbar } from '@/components/layout/Navbar'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'credentials' | 'email'>('credentials')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn('email', {
        email: formData.email,
        redirect: false,
      })

      // Show success message
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
    } catch (err) {
      setError('Failed to send email. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <AuthCard
            title="Sign In"
            description="Access your DermaLabs account"
          >
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setTab('credentials')}
                className={`px-4 py-2 font-medium transition-colors ${
                  tab === 'credentials'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-1'
                    : 'text-gray-600'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setTab('email')}
                className={`px-4 py-2 font-medium transition-colors ${
                  tab === 'email'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-1'
                    : 'text-gray-600'
                }`}
              >
                Email Link
              </button>
            </div>

            {tab === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {tab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <p className="text-xs text-gray-500">
                  We'll send you a link to sign in
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Sending Link...' : 'Send Sign In Link'}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>
          </AuthCard>
        </div>
      </main>
    </>
  )
}
