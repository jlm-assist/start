import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hautClient } from '@/lib/hautClient'

/**
 * POST /api/scans/[scanId]/upload - Upload scan image and trigger analysis
 */
export async function POST(
  req: NextRequest,
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

    // Verify scan exists and user owns it
    const scan = await prisma.scanSession.findUnique({
      where: { id: params.scanId },
    })

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      )
    }

    if (scan.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get image from request
    const formData = await req.formData()
    const imageFile = formData.get('image') as File | null

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const buffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const imageData = `data:image/jpeg;base64,${base64}`

    // Upload to Haut.AI
    const uploadResponse = await hautClient.uploadImage(imageData, {
      anonymized: scan.anonymized,
      metadata: {
        userId: scan.userId,
        scanId: scan.id,
      },
    })

    // Start computation
    const computationResponse = await hautClient.startComputation(
      uploadResponse.imageId,
      {
        preset: scan.anonymized ? 'anonymized' : 'default',
      }
    )

    // Update scan session
    const updatedScan = await prisma.scanSession.update({
      where: { id: params.scanId },
      data: {
        status: 'processing',
        hautJobId: computationResponse.jobId,
        capturedAt: new Date(),
      },
    })

    // Create background job to poll for results
    await prisma.backgroundJob.create({
      data: {
        type: 'process_scan',
        payload: {
          scanId: params.scanId,
          hautJobId: computationResponse.jobId,
        },
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        scanId: updatedScan.id,
        status: updatedScan.status,
        hautJobId: updatedScan.hautJobId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to process scan' },
      { status: 500 }
    )
  }
}
