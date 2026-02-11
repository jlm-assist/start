import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hautClient } from '@/lib/hautClient'
import crypto from 'crypto'

/**
 * Verify webhook signature (if Haut.AI provides one)
 */
function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!process.env.HAUT_WEBHOOK_SECRET) {
    return true // Skip verification if secret not set
  }

  const hash = crypto
    .createHmac('sha256', process.env.HAUT_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return hash === signature
}

/**
 * POST /api/webhooks/haut - Receive Haut.AI webhook events
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('x-haut-signature') || ''

    // Verify signature
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(payload)
    const { jobId, status, data } = event

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId' },
        { status: 400 }
      )
    }

    // Find scan by hautJobId
    const scan = await prisma.scanSession.findFirst({
      where: { hautJobId: jobId },
    })

    if (!scan) {
      console.warn(`Webhook received for unknown job: ${jobId}`)
      return NextResponse.json({ ok: true })
    }

    // Handle completion
    if (status === 'completed' && data) {
      // Fetch full results from Haut
      const results = await hautClient.getResults(jobId)

      // Extract and normalize key metrics
      const normalizedMetrics = {
        skinType: results.metrics.skinType,
        moisture: results.metrics.moisture,
        elasticity: results.metrics.elasticity,
        texture: results.metrics.texture,
        pores: results.metrics.pores,
        pigmentation: results.metrics.pigmentation,
        redness: results.metrics.redness,
        sensitivity: results.metrics.sensitivity,
        lines: results.metrics.lines,
        hydrationLevel: results.metrics.hydrationLevel,
        firmness: results.metrics.firmness,
        radiance: results.metrics.radiance,
      }

      // Update or create result
      await prisma.scanResult.upsert({
        where: { scanSessionId: scan.id },
        create: {
          scanSessionId: scan.id,
          rawJson: results,
          normalizedJson: normalizedMetrics,
        },
        update: {
          rawJson: results,
          normalizedJson: normalizedMetrics,
        },
      })

      // Update scan status
      await prisma.scanSession.update({
        where: { id: scan.id },
        data: { status: 'complete' },
      })

      return NextResponse.json({ ok: true })
    }

    // Handle failure
    if (status === 'failed') {
      await prisma.scanSession.update({
        where: { id: scan.id },
        data: { status: 'failed' },
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
