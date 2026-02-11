'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/ui/AuthCard'
import { Navbar } from '@/components/layout/Navbar'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <AuthCard
            title="Check Your Email"
            description="We've sent a sign-in link to your inbox"
          >
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  A sign-in link has been sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <p>✓ Check your inbox (and spam folder) for an email from DermaLabs</p>
                <p>✓ Click the link in the email to sign in</p>
                <p>✓ The link expires in 24 hours</p>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive an email?
                </p>
                <Link href="/auth/signin" className="btn-outline w-full text-center">
                  Try Again
                </Link>
              </div>
            </div>
          </AuthCard>
        </div>
      </main>
    </>
  )
}
