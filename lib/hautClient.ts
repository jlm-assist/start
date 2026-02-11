import axios from 'axios'

interface UploadImageResponse {
  imageId: string
  url?: string
}

interface ComputationResponse {
  jobId: string
  status: string
}

interface SkinMetrics {
  skinType?: string
  moisture?: number
  elasticity?: number
  texture?: number
  pores?: number
  pigmentation?: number
  redness?: number
  sensitivity?: number
  lines?: number
  [key: string]: any
}

interface AnalysisResult {
  jobId: string
  status: string
  metrics: SkinMetrics
  analysis?: string
  recommendations?: string[]
  auxiliaryImages?: {
    heatmap?: string
    segmentation?: string
    [key: string]: string | undefined
  }
}

class HautClient {
  private apiKey: string
  private apiBase: string
  private appId: string
  private isMockMode: boolean

  constructor() {
    this.apiKey = process.env.HAUT_API_KEY || ''
    this.apiBase = process.env.HAUT_API_BASE_URL || 'https://api.haut.ai'
    this.appId = process.env.HAUT_APP_ID || ''
    this.isMockMode = process.env.HAUT_MOCK === 'true'
  }

  /**
   * Upload image to Haut.AI
   * @param imageData Base64 or file path
   * @param options Upload options
   */
  async uploadImage(
    imageData: string | Buffer,
    options?: {
      anonymized?: boolean
      metadata?: Record<string, any>
    }
  ): Promise<UploadImageResponse> {
    if (this.isMockMode) {
      return this.mockUploadImage()
    }

    try {
      // TODO: Implement actual Haut.AI upload endpoint
      // Expected: POST /api/v1/images/upload
      // Headers: Authorization: Bearer {HAUT_API_KEY}
      // Body: FormData with image file

      const formData = new FormData()
      if (typeof imageData === 'string') {
        const blob = this.base64ToBlob(imageData)
        formData.append('image', blob, 'scan.jpg')
      } else {
        formData.append('image', new Blob([imageData]), 'scan.jpg')
      }

      if (options?.metadata) {
        formData.append('metadata', JSON.stringify(options.metadata))
      }

      // Placeholder implementation
      throw new Error(
        'HAUT_API_KEY not configured. See README for integration steps.'
      )

      // const response = await axios.post(
      //   `${this.apiBase}/api/v1/images/upload`,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${this.apiKey}`,
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // )

      // return {
      //   imageId: response.data.imageId,
      //   url: response.data.url,
      // }
    } catch (error) {
      console.error('Error uploading image to Haut:', error)
      throw error
    }
  }

  /**
   * Start Face Skin Analysis 3.0 computation
   * @param imageId Uploaded image ID
   * @param options Computation options
   */
  async startComputation(
    imageId: string,
    options?: {
      preset?: string
      parameters?: Record<string, any>
    }
  ): Promise<ComputationResponse> {
    if (this.isMockMode) {
      return this.mockStartComputation()
    }

    try {
      // TODO: Implement actual Haut.AI computation endpoint
      // Expected: POST /api/v1/analysis/face-skin-3.0/compute
      // Headers: Authorization: Bearer {HAUT_API_KEY}
      // Body: { imageId, appId, preset?, parameters? }

      throw new Error(
        'HAUT_API_KEY not configured. See README for integration steps.'
      )

      // const response = await axios.post(
      //   `${this.apiBase}/api/v1/analysis/face-skin-3.0/compute`,
      //   {
      //     imageId,
      //     appId: this.appId,
      //     preset: options?.preset || 'default',
      //     parameters: options?.parameters,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${this.apiKey}`,
      //     },
      //   }
      // )

      // return {
      //   jobId: response.data.jobId,
      //   status: response.data.status,
      // }
    } catch (error) {
      console.error('Error starting computation:', error)
      throw error
    }
  }

  /**
   * Get computation results
   * @param jobId Job ID from startComputation
   */
  async getResults(jobId: string): Promise<AnalysisResult> {
    if (this.isMockMode) {
      return this.mockGetResults()
    }

    try {
      // TODO: Implement actual Haut.AI results endpoint
      // Expected: GET /api/v1/analysis/jobs/{jobId}/results
      // Headers: Authorization: Bearer {HAUT_API_KEY}

      throw new Error(
        'HAUT_API_KEY not configured. See README for integration steps.'
      )

      // const response = await axios.get(
      //   `${this.apiBase}/api/v1/analysis/jobs/${jobId}/results`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${this.apiKey}`,
      //     },
      //   }
      // )

      // return {
      //   jobId: response.data.jobId,
      //   status: response.data.status,
      //   metrics: response.data.metrics,
      //   analysis: response.data.analysis,
      //   recommendations: response.data.recommendations,
      //   auxiliaryImages: response.data.auxiliaryImages,
      // }
    } catch (error) {
      console.error('Error fetching results:', error)
      throw error
    }
  }

  /**
   * Get job status
   * @param jobId Job ID to check
   */
  async getJobStatus(jobId: string): Promise<{ status: string; progress?: number }> {
    if (this.isMockMode) {
      return { status: 'completed' }
    }

    try {
      // TODO: Implement status check endpoint
      throw new Error(
        'HAUT_API_KEY not configured. See README for integration steps.'
      )
    } catch (error) {
      console.error('Error checking job status:', error)
      throw error
    }
  }

  /**
   * Get auxiliary images (heatmaps, segmentation, etc.)
   * @param jobId Job ID
   */
  async getAuxImages(jobId: string): Promise<Record<string, string>> {
    if (this.isMockMode) {
      return this.mockGetAuxImages()
    }

    try {
      // TODO: Implement auxiliary images endpoint
      throw new Error(
        'HAUT_API_KEY not configured. See README for integration steps.'
      )
    } catch (error) {
      console.error('Error fetching auxiliary images:', error)
      throw error
    }
  }

  // Mock functions for development/testing
  private mockUploadImage(): UploadImageResponse {
    return {
      imageId: `mock-img-${Date.now()}`,
      url: 'https://via.placeholder.com/400',
    }
  }

  private mockStartComputation(): ComputationResponse {
    return {
      jobId: `mock-job-${Date.now()}`,
      status: 'pending',
    }
  }

  private mockGetResults(): AnalysisResult {
    // Deterministic mock data based on timestamp for consistency
    const hour = new Date().getHours()
    const baseScore = 50 + (hour * 2)

    return {
      jobId: 'mock-job-123',
      status: 'completed',
      metrics: {
        skinType: 'Combination',
        moisture: Math.min(100, baseScore),
        elasticity: Math.min(100, baseScore - 5),
        texture: Math.min(100, baseScore - 10),
        pores: Math.min(100, 70 + Math.random() * 20),
        pigmentation: Math.min(100, baseScore - 15),
        redness: Math.min(100, 30 + Math.random() * 20),
        sensitivity: Math.min(100, 40 + Math.random() * 20),
        lines: Math.max(0, baseScore - 80),
        hydrationLevel: Math.min(100, baseScore + 5),
        firmness: Math.min(100, baseScore - 8),
        radiance: Math.min(100, baseScore - 3),
      },
      analysis: 'Your skin is showing good hydration levels with room for improvement in elasticity.',
      recommendations: [
        'Increase water intake for better hydration',
        'Use retinol-based products for elasticity improvement',
        'Consistent SPF 30+ daily sun protection',
        'Consider professional hydrating treatments',
      ],
      auxiliaryImages: {
        heatmap: 'https://via.placeholder.com/400x300?text=Heatmap',
        segmentation: 'https://via.placeholder.com/400x300?text=Segmentation',
      },
    }
  }

  private mockGetAuxImages(): Record<string, string> {
    return {
      heatmap: 'https://via.placeholder.com/400x300?text=Heatmap',
      segmentation: 'https://via.placeholder.com/400x300?text=Segmentation',
      raw: 'https://via.placeholder.com/400x300?text=Raw+Image',
    }
  }

  private base64ToBlob(base64: string): Blob {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    return new Blob([u8arr], { type: mime })
  }
}

export const hautClient = new HautClient()
export type { AnalysisResult, SkinMetrics }
