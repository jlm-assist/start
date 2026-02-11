'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleComplete = async () => {
    if (!consent) return

    setLoading(true)
    try {
      // Redirect to first scan
      router.push('/scan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max max-w-2xl">
          <div className="space-y-12">
            {/* Welcome */}
            <section className="card p-8">
              <h1 className="section-header">Welcome to DermaLabs SkinScan</h1>
              <p className="text-gray-600 text-lg mb-4">
                Before you start, please review these important guidelines to ensure accurate scan results.
              </p>
            </section>

            {/* Scan Instructions */}
            <section className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Perform a Scan</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prepare Your Face</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Clean your face with water only. Remove makeup, sunscreen, and skincare products at least 30 minutes before scanning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Choose Your Location</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Use the same location and time of day for all scans. Natural lighting is ideal—avoid harsh shadows.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Neutral Expression</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Face forward with a relaxed, neutral expression. Look directly at the camera.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Consistent Framing</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Keep your face centered in the frame, showing your entire face from forehead to chin.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy & Consent */}
            <section className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Data Usage</h2>

              <div className="space-y-4 text-gray-600 text-sm mb-6">
                <p>
                  <strong>Your Privacy Matters:</strong> By default, we store only anonymized scan data and processed analysis results. Your original facial images are not permanently stored unless you explicitly opt out of anonymization.
                </p>
                <p>
                  Images are sent to Haut.AI for analysis and are subject to their terms of service. Learn more in our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <div className="border-t pt-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I understand the scanning guidelines and consent to sending my images to Haut.AI for analysis. I have read and agree to the privacy policy.
                  </span>
                </label>
              </div>
            </section>

            {/* CTA */}
            <div className="flex gap-4">
              <button
                onClick={handleComplete}
                disabled={!consent || loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Starting...' : 'Ready to Scan'}
              </button>
              <Link href="/dashboard" className="btn-outline flex-1 text-center">
                Skip for Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
