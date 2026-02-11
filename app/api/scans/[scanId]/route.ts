import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/scans/[scanId] - Get scan details
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { scanId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const scan = await prisma.scanSession.findUnique({
      where: { id: params.scanId },
      include: { result: true },
    })

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (scan.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      scan: {
        id: scan.id,
        createdAt: scan.createdAt,
        capturedAt: scan.capturedAt,
        status: scan.status,
        anonymized: scan.anonymized,
        result: scan.result ? {
          rawJson: scan.result.rawJson,
          normalizedJson: scan.result.normalizedJson,
        } : null,
      },
    })
  } catch (error) {
    console.error('Error fetching scan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
