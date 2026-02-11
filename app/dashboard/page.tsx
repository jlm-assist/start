'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { MetricCard } from '@/components/ui/MetricCard'
import { TrendChart } from '@/components/ui/TrendChart'
import { formatDateShort, daysAgo } from '@/lib/utils'

interface Scan {
  id: string
  createdAt: string
  status: string
  metrics: any
  hasResult: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const { status } = useSession()
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  // Load scans
  useEffect(() => {
    const loadScans = async () => {
      try {
        const res = await fetch('/api/scans')
        if (!res.ok) throw new Error('Failed to load scans')
        const data = await res.json()
        setScans(data.scans)
      } catch (err) {
        setError('Failed to load scan history')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      loadScans()
    }
  }, [status])

  const completedScans = scans.filter(s => s.status === 'complete' && s.hasResult)
  const latestScan = completedScans[0]

  // Prepare trend data
  const trendData = completedScans
    .slice(0, 12)
    .reverse()
    .map((scan) => ({
      date: formatDateShort(new Date(scan.createdAt)),
      value: scan.metrics?.moisture || 0,
    }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="section-header">Dashboard</h1>
                <p className="text-gray-600">
                  Track your skin health over time
                </p>
              </div>
              <Link href="/scan" className="btn-primary">
                New Scan
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Latest Scan Summary */}
            {latestScan ? (
              <div className="card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Latest Scan
                    </h2>
                    <p className="text-sm text-gray-600">
                      {daysAgo(new Date(latestScan.createdAt))} days ago
                    </p>
                  </div>
                  <Link
                    href={`/report/${latestScan.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Full Report
                  </Link>
                </div>

                {latestScan.metrics && (
                  <div className="grid md:grid-cols-4 gap-4">
                    <MetricCard
                      label="Moisture"
                      value={latestScan.metrics.moisture}
                    />
                    <MetricCard
                      label="Elasticity"
                      value={latestScan.metrics.elasticity}
                    />
                    <MetricCard
                      label="Texture"
                      value={latestScan.metrics.texture}
                    />
                    <MetricCard
                      label="Pores"
                      value={latestScan.metrics.pores}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Trends */}
            {trendData.length > 1 && (
              <TrendChart
                title="Skin Moisture Trend"
                data={trendData}
                color="#0066cc"
              />
            )}

            {/* Metrics Grid */}
            {latestScan?.metrics && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Condition Metrics</h3>
                  <div className="grid gap-4">
                    <MetricCard
                      label="Pigmentation"
                      value={latestScan.metrics.pigmentation}
                      description="Uneven tone or discoloration"
                    />
                    <MetricCard
                      label="Redness"
                      value={latestScan.metrics.redness}
                      description="Inflammation or irritation"
                    />
                    <MetricCard
                      label="Sensitivity"
                      value={latestScan.metrics.sensitivity}
                      description="Reactivity level"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Texture & Age</h3>
                  <div className="grid gap-4">
                    <MetricCard
                      label="Lines"
                      value={latestScan.metrics.lines}
                      description="Fine lines and wrinkles"
                    />
                    <MetricCard
                      label="Firmness"
                      value={latestScan.metrics.firmness}
                      description="Skin resilience"
                    />
                    <MetricCard
                      label="Radiance"
                      value={latestScan.metrics.radiance}
                      description="Overall glow"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scan History Table */}
            {scans.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Scan History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                          Metrics
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.slice(0, 10).map(scan => (
                        <tr key={scan.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">
                            {formatDateShort(new Date(scan.createdAt))}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              scan.status === 'complete'
                                ? 'bg-green-100 text-green-800'
                                : scan.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : scan.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {scan.hasResult ? 'Available' : '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {scan.hasResult && (
                              <Link
                                href={`/report/${scan.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                View
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && scans.length === 0 && (
              <div className="card p-12 text-center">
                <p className="text-gray-600 mb-6">
                  No scans yet. Start your first scan to begin tracking your skin health.
                </p>
                <Link href="/scan" className="btn-primary">
                  Perform First Scan
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
