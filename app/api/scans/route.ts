import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/scans - Get user's scans
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const scans = await prisma.scanSession.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        result: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      scans: scans.map(scan => ({
        id: scan.id,
        createdAt: scan.createdAt,
        capturedAt: scan.capturedAt,
        status: scan.status,
        anonymized: scan.anonymized,
        hasResult: !!scan.result,
        metrics: scan.result?.normalizedJson || null,
      })),
    })
  } catch (error) {
    console.error('Error fetching scans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/scans - Create new scan session
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { anonymized = true, liqaIframe = false } = body

    const scan = await prisma.scanSession.create({
      data: {
        userId: session.user.id,
        anonymized,
        liqaIframe,
        status: 'created',
      },
    })

    return NextResponse.json(
      {
        scanId: scan.id,
        status: scan.status,
        anonymized: scan.anonymized,
        liqaIframe: scan.liqaIframe,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating scan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
