'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function ScanPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanId, setScanId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [anonymized, setAnonymized] = useState(true)
  const [useIframe, setUseIframe] = useState(false)
  const liqaContainerRef = useRef<HTMLDivElement>(null)

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  // Initialize scan session
  useEffect(() => {
    const initializeScan = async () => {
      try {
        const res = await fetch('/api/scans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymized,
            liqaIframe: useIframe,
          }),
        })

        if (!res.ok) {
          throw new Error('Failed to initialize scan')
        }

        const data = await res.json()
        setScanId(data.scanId)
      } catch (err) {
        setError('Failed to initialize scan session')
        console.error(err)
      }
    }

    if (!scanId) {
      initializeScan()
    }
  }, [scanId])

  // Initialize LIQA component (placeholder - integrate real LIQA SDK)
  useEffect(() => {
    if (!liqaContainerRef.current || !scanId) return

    // TODO: Load and initialize real Haut.AI LIQA web component
    // This is a placeholder showing how to integrate LIQA
    const loadLIQA = async () => {
      try {
        // Load LIQA script
        // const script = document.createElement('script')
        // script.src = 'https://app.haut.ai/liqa/web-component.js'
        // script.async = true
        // document.body.appendChild(script)

        // Once loaded, initialize:
        // const liqaElement = document.createElement('haut-liqa')
        // liqaElement.setAttribute('app-id', process.env.NEXT_PUBLIC_HAUT_APP_ID || '')
        // liqaElement.setAttribute('preset', 'face')
        // if (anonymized) {
        //   liqaElement.setAttribute('postprocessing', 'anonymized')
        // }
        // if (useIframe) {
        //   liqaElement.setAttribute('use-iframe', 'true')
        // }
        // liqaElement.addEventListener('capture', handleCapture)

        // For now, show placeholder
        const placeholder = document.createElement('div')
        placeholder.className = 'flex items-center justify-center h-96 bg-gray-100 rounded-lg'
        placeholder.innerHTML = `
          <div class="text-center">
            <p class="text-gray-600 mb-4">LIQA Web Component</p>
            <p class="text-sm text-gray-500">Integration with Haut.AI LIQA SDK required</p>
          </div>
        `
        liqaContainerRef.current.appendChild(placeholder)
      } catch (err) {
        setError('Failed to load LIQA component')
        console.error(err)
      }
    }

    loadLIQA()
  }, [scanId, anonymized, useIframe])

  const handleCapture = async (imageBlob: Blob) => {
    if (!scanId) return

    setScanning(true)
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', imageBlob, 'scan.jpg')

      const res = await fetch(`/api/scans/${scanId}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Failed to upload scan')
      }

      const data = await res.json()

      // Redirect to status/results page
      router.push(`/report/${data.scanId}`)
    } catch (err) {
      setError('Failed to process scan. Please try again.')
      console.error(err)
      setScanning(false)
    } finally {
      setLoading(false)
    }
  }

  // Simulate capture for demo
  const handleDemoCapture = async () => {
    if (!scanId) return

    setScanning(true)
    setLoading(true)
    setError('')

    try {
      // Create a demo image (white canvas)
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#e5e7eb'
        ctx.fillRect(0, 0, 640, 480)
        ctx.fillStyle = '#666'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Demo Facial Scan Image', 320, 240)
      }

      canvas.toBlob((blob) => {
        if (blob) {
          handleCapture(blob)
        }
      }, 'image/jpeg')
    } catch (err) {
      setError('Failed to create demo scan')
      console.error(err)
      setScanning(false)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max max-w-2xl">
          <div className="space-y-8">
            {/* Header */}
            <section className="text-center">
              <h1 className="section-header">Facial Scan</h1>
              <p className="text-gray-600">
                Position your face in good lighting and capture a clear image
              </p>
            </section>

            {/* Settings Card */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Scan Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={anonymized}
                    onChange={(e) => setAnonymized(e.target.checked)}
                    disabled={scanning}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Enable privacy anonymization
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={useIframe}
                    onChange={(e) => setUseIframe(e.target.checked)}
                    disabled={scanning}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Use iframe isolation
                  </span>
                </label>
              </div>
            </div>

            {/* Camera/LIQA Area */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Camera</h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                  {error}
                </div>
              )}

              <div
                ref={liqaContainerRef}
                className="bg-gray-100 rounded-lg overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                {/* LIQA component or placeholder will be inserted here */}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleDemoCapture}
                  disabled={scanning || loading || !scanId}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Capture Scan'}
                </button>
                <Link href="/dashboard" className="btn-outline flex-1 text-center">
                  Cancel
                </Link>
              </div>
            </div>

            {/* Instructions */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-blue-900">
                <li>✓ Good lighting is essential—use natural window light if possible</li>
                <li>✓ Keep your face centered and fill most of the frame</li>
                <li>✓ Maintain a neutral expression</li>
                <li>✓ Remove eyeglasses for better facial recognition</li>
                <li>✓ Perform scans at the same time each week for consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
