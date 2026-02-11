import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container-max max-w-2xl">
            <div className="text-center space-y-6 fade-in">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Scan Your Skin.
                <br />
                Track Your Progress.
              </h1>
              <p className="text-xl text-gray-600">
                Powered by Haut.AI, DermaLabs SkinScan provides weekly facial analysis and longitudinal skin health tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link href="/auth/signup" className="btn-primary text-center">
                  Create Account
                </Link>
                <Link href="/auth/signin" className="btn-outline text-center">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-max">
            <h2 className="section-header text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Weekly Scans
                </h3>
                <p className="text-gray-600">
                  Capture consistent facial images using our LIQA integration with optional privacy anonymization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Advanced Haut.AI Face Skin Analysis 3.0 provides detailed skin metrics across multiple dimensions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Trends
                </h3>
                <p className="text-gray-600">
                  Monitor longitudinal trends in skin health with visual charts and detailed historical reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container-max text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start tracking your skin health?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Create a free account and perform your first scan today.
            </p>
            <Link href="/auth/signup" className="btn-primary inline-block">
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
