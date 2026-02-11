import { Navbar } from '@/components/layout/Navbar'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-clinical-neutral py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max max-w-3xl">
          <div className="card p-8 space-y-8">
            <div>
              <h1 className="section-header">Privacy Policy</h1>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="text-gray-600">
                DermaLabs SkinScan ("we," "us," "our") is committed to protecting your privacy.
                This policy explains how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">What We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Account Information</h3>
                  <p className="text-gray-600 text-sm">
                    Email address, name, and password hash (encrypted)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Scan Data</h3>
                  <p className="text-gray-600 text-sm">
                    Facial images (temporarily), analysis results, and skin metrics
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Usage Data</h3>
                  <p className="text-gray-600 text-sm">
                    Access times, pages viewed, and referral information
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Image Storage & Anonymization</h2>
              <div className="space-y-3 text-gray-600 text-sm">
                <p>
                  <strong>Default Behavior:</strong> Facial images are sent to Haut.AI for analysis.
                  We do not permanently store original images by default. Only anonymized analysis
                  results and processed metrics are retained.
                </p>
                <p>
                  <strong>Optional Storage:</strong> You may enable image storage during onboarding.
                  If enabled, only anonymized variants are stored for future analysis comparison.
                </p>
                <p>
                  <strong>Privacy Anonymization:</strong> By default, the privacy anonymization option
                  is enabled, which applies Haut.AI's postprocessing to remove identifiable features
                  while preserving analysis accuracy.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
              <div className="space-y-3 text-gray-600 text-sm">
                <p>
                  <strong>Haut.AI:</strong> Facial images and analysis requests are sent to Haut.AI's
                  servers for Face Skin Analysis 3.0. Please review Haut.AI's privacy policy for
                  details on their data handling practices.
                </p>
                <p>
                  <strong>Email Provider:</strong> We use a third-party email service for magic link
                  authentication. Email addresses are transmitted securely.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Request access to your personal data</li>
                <li>✓ Request correction of inaccurate data</li>
                <li>✓ Request deletion of your account and associated scans</li>
                <li>✓ Download your scan history and results</li>
                <li>✓ Opt out of optional image storage</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              <p className="text-gray-600 text-sm">
                We implement industry-standard security measures including:
              </p>
              <ul className="space-y-2 text-gray-600 text-sm ml-4">
                <li>• HTTPS encryption for all data transmission</li>
                <li>• Bcrypt password hashing with salt</li>
                <li>• PostgreSQL database with access controls</li>
                <li>• Regular security audits and updates</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
              <p className="text-gray-600 text-sm">
                Scan results and metrics are retained indefinitely for longitudinal analysis unless
                you request deletion. Account data is retained until account termination.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Changes to This Policy</h2>
              <p className="text-gray-600 text-sm">
                We may update this policy periodically. Significant changes will be communicated via email.
              </p>
            </section>

            <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold text-gray-900">Questions?</h2>
              <p className="text-gray-600 text-sm">
                Contact us at privacy@dermalabs.app with any privacy concerns or requests.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
