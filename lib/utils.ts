import bcrypt from 'bcryptjs'

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a random token for verification
 */
export function generateToken(length: number = 32): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Format date to short format
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Calculate days ago
 */
export function daysAgo(date: Date): number {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format metric value
 */
export function formatMetric(value: number | undefined, unit?: string): string {
  if (value === undefined || value === null) {
    return 'N/A'
  }
  const rounded = Math.round(value * 10) / 10
  return unit ? `${rounded}${unit}` : `${rounded}%`
}

/**
 * Get metric color based on value (0-100 scale)
 */
export function getMetricColor(value: number | undefined): string {
  if (value === undefined || value === null) {
    return 'gray'
  }
  if (value >= 80) return 'green'
  if (value >= 60) return 'yellow'
  return 'red'
}

/**
 * Convert image file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get metric trend (up/down/stable)
 */
export function getMetricTrend(
  current: number,
  previous: number
): 'up' | 'down' | 'stable' {
  const diff = current - previous
  if (Math.abs(diff) < 2) return 'stable'
  return diff > 0 ? 'up' : 'down'
}

/**
 * Calculate percentage change
 */
export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
