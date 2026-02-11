import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hautClient } from '@/lib/hautClient'

/**
 * GET /api/cron/process-jobs - Process pending background jobs
 * Should be called by an external scheduler (e.g., Vercel Cron)
 */
export async function GET(req: NextRequest) {
  // Basic auth check using a cron secret
  const authHeader = req.headers.get('authorization')
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`

  if (authHeader !== expectedAuth && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Get pending jobs
    const jobs = await prisma.backgroundJob.findMany({
      where: {
        status: 'pending',
        type: 'process_scan',
      },
      take: 10, // Process 10 at a time
    })

    let processed = 0
    let completed = 0

    for (const job of jobs) {
      try {
        const payload = job.payload as {
          scanId: string
          hautJobId: string
        }

        // Check job status
        const status = await hautClient.getJobStatus(payload.hautJobId)

        if (status.status === 'completed') {
          // Fetch results
          const results = await hautClient.getResults(payload.hautJobId)

          // Normalize metrics
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

          // Save results
          await prisma.scanResult.upsert({
            where: { scanSessionId: payload.scanId },
            create: {
              scanSessionId: payload.scanId,
              rawJson: results,
              normalizedJson: normalizedMetrics,
            },
            update: {
              rawJson: results,
              normalizedJson: normalizedMetrics,
            },
          })

          // Update scan
          await prisma.scanSession.update({
            where: { id: payload.scanId },
            data: { status: 'complete' },
          })

          // Mark job done
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: {
              status: 'completed',
              processedAt: new Date(),
            },
          })

          completed++
        } else if (status.status === 'failed') {
          // Mark job failed
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: {
              status: 'failed',
              error: 'Haut.AI job failed',
            },
          })
        }
        // else job still processing, leave as pending

        processed++
      } catch (jobError) {
        console.error(`Error processing job ${job.id}:`, jobError)

        // Increment retry count
        const newRetries = job.retries + 1
        if (newRetries >= job.maxRetries) {
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: {
              status: 'failed',
              error: String(jobError),
            },
          })
        } else {
          await prisma.backgroundJob.update({
            where: { id: job.id },
            data: {
              retries: newRetries,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      completed,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
