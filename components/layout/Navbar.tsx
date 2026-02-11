'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container-max flex items-center justify-between h-16">
        <Link href={session ? '/dashboard' : '/'} className="text-xl font-bold text-blue-600">
          DermaLabs
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/scan"
              className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              New Scan
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
              >
                {session.user?.email}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/privacy"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Privacy
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
