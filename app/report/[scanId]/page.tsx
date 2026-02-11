'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { MetricCard } from '@/components/ui/MetricCard'
import { formatDate, daysAgo } from '@/lib/utils'

interface ReportData {
  id: string
  status: string
  createdAt: string
  capturedAt?: string
  metrics?: any
  rawJson?: any
  analysis?: string
  recommendations?: string[]
}

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRaw, setShowRaw] = useState(false)
  const scanId = params.scanId as string

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  // Load report
  useEffect(() => {
    const loadReport = async () => {
      if (!scanId) return

      try {
        const res = await fetch(`/api/scans/${scanId}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Scan not found')
          } else if (res.status === 403) {
            setError('You do not have access to this scan')
          } else {
            setError('Failed to load report')
          }
          return
        }

        const data = await res.json()
        const scanData = data.scan

        // Poll for results if still processing
        if (scanData.status === 'processing') {
          const pollStatus = setInterval(async () => {
            const statusRes = await fetch(`/api/scans/${scanId}/status`)
            if (statusRes.ok) {
              const statusData = await statusRes.json()
              if (statusData.status === 'complete' && statusData.metrics) {
                clearInterval(pollStatus)
                setReport({
                  id: scanData.id,
                  status: statusData.status,
                  createdAt: scanData.createdAt,
                  capturedAt: scanData.capturedAt,
                  metrics: statusData.metrics,
                  rawJson: scanData.result?.rawJson,
                })
                setLoading(false)
              } else if (statusData.status === 'failed') {
                clearInterval(pollStatus)
                setError('Scan processing failed')
                setLoading(false)
              }
            }
          }, 2000) // Poll every 2 seconds

          // Timeout after 5 minutes
          setTimeout(() => clearInterval(pollStatus), 5 * 60 * 1000)
        } else {
          setReport({
            id: scanData.id,
            status: scanData.status,
            createdAt: scanData.createdAt,
            capturedAt: scanData.capturedAt,
            metrics: scanData.result?.normalizedJson || scanData.result?.rawJson?.metrics,
            rawJson: scanData.result?.rawJson,
          })
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to load report')
        console.error(err)
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadReport()
    }
  }, [scanId, status])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
          <div className="container-max text-center">
            <p className="text-gray-600">Loading report...</p>
          </div>
        </main>
      </>
    )
  }

  if (error || !report) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
          <div className="container-max max-w-2xl">
            <div className="card p-6 text-center">
              <p className="text-red-700 mb-6">{error || 'Report not found'}</p>
              <Link href="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const { metrics, rawJson } = report

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="section-header">Scan Report</h1>
                <p className="text-gray-600">
                  Captured {daysAgo(new Date(report.createdAt))} days ago
                </p>
              </div>
              <Link href="/dashboard" className="btn-outline">
                Back to Dashboard
              </Link>
            </div>

            {/* Status */}
            {report.status === 'processing' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                Analysis in progress. This page will update automatically.
              </div>
            )}

            {report.status === 'failed' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                Scan processing failed. Please try again.
              </div>
            )}

            {/* Metrics Grid */}
            {metrics && (
              <>
                <div className="grid md:grid-cols-4 gap-4">
                  <MetricCard label="Moisture" value={metrics.moisture} />
                  <MetricCard label="Elasticity" value={metrics.elasticity} />
                  <MetricCard label="Texture" value={metrics.texture} />
                  <MetricCard label="Pores" value={metrics.pores} />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <MetricCard label="Pigmentation" value={metrics.pigmentation} />
                  <MetricCard label="Redness" value={metrics.redness} />
                  <MetricCard label="Sensitivity" value={metrics.sensitivity} />
                  <MetricCard label="Lines" value={metrics.lines} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <MetricCard label="Hydration" value={metrics.hydrationLevel} />
                  <MetricCard label="Firmness" value={metrics.firmness} />
                  <MetricCard label="Radiance" value={metrics.radiance} />
                </div>
              </>
            )}

            {/* Analysis & Recommendations */}
            {(rawJson?.analysis || rawJson?.recommendations) && (
              <div className="card p-6">
                {rawJson.analysis && (
                  <div className="mb-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Analysis</h2>
                    <p className="text-gray-600 text-sm">{rawJson.analysis}</p>
                  </div>
                )}

                {rawJson.recommendations && Array.isArray(rawJson.recommendations) && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-3">Recommendations</h2>
                    <ul className="space-y-2">
                      {rawJson.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-600">
                          <span className="text-blue-600 font-medium">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON */}
            {rawJson && (
              <div className="card p-6">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="flex items-center gap-2 font-semibold text-gray-900 mb-4"
                >
                  <span>{showRaw ? '▼' : '▶'}</span>
                  Raw Analysis Data
                </button>

                {showRaw && (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-700">
                    {JSON.stringify(rawJson, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
