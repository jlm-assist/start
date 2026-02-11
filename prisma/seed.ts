import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('DemoPassword123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@dermalabs.app' },
    update: {},
    create: {
      email: 'demo@dermalabs.app',
      name: 'Demo User',
      passwordHash: hashedPassword,
    },
  })

  console.log(`✓ Created user: ${user.email}`)

  // Create demo scans with results
  const mockMetrics = {
    skinType: 'Combination',
    moisture: 72,
    elasticity: 65,
    texture: 70,
    pores: 68,
    pigmentation: 75,
    redness: 25,
    sensitivity: 30,
    lines: 15,
    hydrationLevel: 74,
    firmness: 68,
    radiance: 70,
  }

  // Create 4 demo scans (1 per week for the past month)
  for (let i = 0; i < 4; i++) {
    const daysAgo = 7 * i
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - daysAgo)

    const scan = await prisma.scanSession.create({
      data: {
        userId: user.id,
        createdAt,
        capturedAt: createdAt,
        status: 'complete',
        anonymized: true,
        liqaIframe: false,
        hautJobId: `demo-job-${i}`,
      },
    })

    // Add slight variation to metrics for trend visualization
    const variedMetrics = {
      ...mockMetrics,
      moisture: mockMetrics.moisture + Math.random() * 10 - 5,
      elasticity: mockMetrics.elasticity + Math.random() * 10 - 5,
      texture: mockMetrics.texture + Math.random() * 10 - 5,
      pores: mockMetrics.pores + Math.random() * 10 - 5,
      hydrationLevel: mockMetrics.hydrationLevel + Math.random() * 10 - 5,
    }

    await prisma.scanResult.create({
      data: {
        scanSessionId: scan.id,
        normalizedJson: variedMetrics,
        rawJson: {
          ...variedMetrics,
          analysis: 'Your skin is showing good overall health with consistent hydration.',
          recommendations: [
            'Continue current skincare routine',
            'Increase water intake for better hydration',
            'Use SPF 30+ daily',
            'Consider retinol products for elasticity improvement',
          ],
          auxiliaryImages: {
            heatmap: 'https://via.placeholder.com/400x300?text=Heatmap',
            segmentation: 'https://via.placeholder.com/400x300?text=Segmentation',
          },
        },
      },
    })

    console.log(`✓ Created demo scan ${i + 1} with results`)
  }

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('Demo credentials:')
  console.log('  Email: demo@dermalabs.app')
  console.log('  Password: DemoPassword123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
