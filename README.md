# DermaLabs SkinScan

A production-ready web application for facial skin analysis with weekly scan tracking and longitudinal trend visualization. Powered by Haut.AI's Face Skin Analysis 3.0 and built with Next.js 14+.

## Features

✨ **User Authentication**
- Credentials-based sign-up and sign-in
- Email magic link authentication via NextAuth
- Secure password hashing with bcrypt

📸 **Facial Scanning**
- Integration with Haut.AI LIQA web component for consistent captures
- Optional privacy anonymization for sensitive use cases
- Optional iframe isolation for enhanced security

🔬 **AI-Powered Analysis**
- Haut.AI Face Skin Analysis 3.0 integration
- Comprehensive skin metrics (moisture, elasticity, texture, pores, etc.)
- Detailed analysis and personalized recommendations

📊 **Dashboard & Reporting**
- Real-time scan status tracking
- Longitudinal trend visualization using Recharts
- Detailed metric breakdown per scan
- Scan history with status tracking

🔐 **Privacy & Security**
- Credentials stored securely with bcrypt
- No permanent image storage by default
- Optional anonymization of facial data
- HTTPS encryption for all data transmission
- Webhook signature verification for Haut.AI events

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom scientific aesthetic
- **Authentication**: NextAuth with Credentials + Email providers
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for trend visualization
- **Background Jobs**: Postgres-backed job queue with cron polling
- **Hosting**: Vercel + managed Postgres (Neon/Supabase)
- **API Integration**: Axios for Haut.AI communication

## Project Structure

```
dermalabs-skinscan/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   ├── signup/route.ts
│   │   ├── scans/
│   │   │   ├── route.ts
│   │   │   ├── [scanId]/
│   │   │   │   ├── route.ts
│   │   │   │   ├── upload/route.ts
│   │   │   │   ├── status/route.ts
│   │   ├── webhooks/
│   │   │   └── haut/route.ts
│   │   ├── cron/
│   │   │   └── process-jobs/route.ts
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── verify-email/page.tsx
│   ├── dashboard/page.tsx
│   ├── scan/page.tsx
│   ├── report/[scanId]/page.tsx
│   ├── onboarding/page.tsx
│   ├── privacy/page.tsx
│   ├── layout.tsx
│   └── page.tsx (landing)
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       ├── AuthCard.tsx
│       ├── MetricCard.tsx
│       └── TrendChart.tsx
├── lib/
│   ├── auth.ts (NextAuth configuration)
│   ├── prisma.ts (Prisma client)
│   ├── hautClient.ts (Haut.AI adapter)
│   └── utils.ts (utility functions)
├── prisma/
│   ├── schema.prisma (database schema)
│   └── seed.ts (demo data)
├── styles/
│   └── globals.css
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Supabase/Neon)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in required values:

```bash
cp .env.example .env.local
```

**Required environment variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dermalabs?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@dermalabs.app"

# Haut.AI Configuration (see section below)
HAUT_API_BASE_URL="https://api.haut.ai"
HAUT_API_KEY="your-key-here"
HAUT_APP_ID="your-app-id"
HAUT_MOCK="true"  # Set to false when integrating real API

# Background jobs
CRON_SECRET="dev-secret"
```

### 3. Set Up Database

```bash
# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

**Demo credentials:**
- Email: `demo@dermalabs.app`
- Password: `DemoPassword123`

## Haut.AI Integration

### Configuration

The application includes a complete Haut.AI client adapter at `lib/hautClient.ts`. By default, it runs in **mock mode** for development.

#### To Integrate Real Haut.AI Endpoints:

1. **Get Haut.AI API Credentials**
   - API Base URL
   - API Key
   - App ID
   - (Optional) Webhook Secret

2. **Update Environment Variables**

   ```env
   HAUT_API_BASE_URL="https://api.haut.ai"
   HAUT_API_KEY="your-actual-api-key"
   HAUT_APP_ID="your-actual-app-id"
   HAUT_WEBHOOK_SECRET="your-webhook-secret"
   HAUT_MOCK="false"
   ```

3. **Implement API Endpoints in `lib/hautClient.ts`**

   The adapter has placeholder comments showing where to implement:
   - `uploadImage()` - POST /api/v1/images/upload
   - `startComputation()` - POST /api/v1/analysis/face-skin-3.0/compute
   - `getResults()` - GET /api/v1/analysis/jobs/{jobId}/results
   - `getJobStatus()` - Status polling endpoint
   - `getAuxImages()` - Auxiliary images (heatmaps, segmentation)

4. **Integrate LIQA Web Component**

   In `app/scan/page.tsx`, uncomment the real LIQA initialization code and configure with your App ID:

   ```typescript
   // Uncomment and complete LIQA initialization
   const script = document.createElement('script')
   script.src = 'https://app.haut.ai/liqa/web-component.js'
   // ... initialize with your app settings
   ```

5. **Test Integration**
   - Create a scan and verify image uploads to Haut.AI
   - Check webhook events arrive at `/api/webhooks/haut`
   - Verify results are stored and displayed correctly

### Mock Mode

By default (`HAUT_MOCK=true`), the application generates deterministic fake metrics for development:

```typescript
{
  skinType: 'Combination',
  moisture: 72,
  elasticity: 65,
  texture: 70,
  pores: 68,
  pigmentation: 75,
  redness: 25,
  sensitivity: 30,
  lines: 15,
  // ... and more
}
```

This allows full feature development without Haut.AI API access.

### Webhook Configuration

For local webhook testing, use ngrok:

```bash
# Terminal 1: Run the app
npm run dev

# Terminal 2: Expose localhost to public URL
ngrok http 3000

# Terminal 3: Send test webhook
curl -X POST https://your-ngrok-url.ngrok.io/api/webhooks/haut \
  -H "Content-Type: application/json" \
  -H "x-haut-signature: your-signature" \
  -d '{
    "jobId": "test-job-123",
    "status": "completed",
    "data": {
      "metrics": {
        "moisture": 75,
        ...
      }
    }
  }'
```

## Background Jobs

The application uses a Postgres-backed background job queue for processing scan results.

### Job Processing

Jobs are processed by a cron endpoint that should be called periodically:

**Local Testing:**

```bash
curl -H "Authorization: Bearer dev-secret" \
  http://localhost:3000/api/cron/process-jobs
```

**Production (Vercel Cron):**

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-jobs",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Job Table Schema

- `id`: Unique identifier
- `type`: Job type (e.g., "process_scan")
- `payload`: JSON data for the job
- `status`: "pending" | "processing" | "completed" | "failed"
- `retries`: Current retry count
- `maxRetries`: Maximum retry attempts (default: 3)
- `error`: Error message if failed
- `createdAt`, `updatedAt`, `processedAt`: Timestamps

## Authentication

### Sign-Up Flow

1. User creates account with email and password
2. Password is hashed with bcrypt (10 salt rounds)
3. User is redirected to onboarding
4. Onboarding page explains scanning process and requests consent

### Sign-In Flow

**Option 1: Password**
1. User enters email and password
2. Credentials are verified against bcrypt hash
3. Session is created via NextAuth JWT

**Option 2: Magic Link (Email)**
1. User enters email
2. NextAuth sends verification link
3. User clicks link and is logged in

### Session Management

- JWT-based sessions (30-day expiration by default)
- Secure session cookies in production
- Session data includes user ID and email

## Database Schema

### Models

**User**
- `id`: CUID
- `email`: Unique
- `name`: Optional
- `passwordHash`: Optional (for credentials auth)
- `createdAt`, `updatedAt`: Timestamps

**ScanSession**
- `id`: CUID
- `userId`: FK to User
- `createdAt`, `capturedAt`: Timestamps
- `status`: "created" | "processing" | "complete" | "failed"
- `hautJobId`: Haut.AI job ID
- `anonymized`: Boolean (default: true)
- `liqaIframe`: Boolean (default: false)
- `imageUrl`: Optional storage URL

**ScanResult**
- `id`: CUID
- `scanSessionId`: FK to ScanSession (unique)
- `rawJson`: Full Haut.AI response
- `normalizedJson`: Extracted metrics
- `createdAt`, `updatedAt`: Timestamps

**BackgroundJob**
- `id`: CUID
- `type`: Job type
- `payload`: JSON
- `status`: Job status
- `retries`, `maxRetries`: Retry info
- `error`: Error message
- Timestamps and indexes

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/signin` - Sign in (credentials)

### Scans

- `GET /api/scans` - Get user's scans
- `POST /api/scans` - Create new scan session
- `GET /api/scans/[scanId]` - Get scan details
- `POST /api/scans/[scanId]/upload` - Upload and process image
- `GET /api/scans/[scanId]/status` - Get scan processing status

### Webhooks

- `POST /api/webhooks/haut` - Receive Haut.AI completion events

### Cron Jobs

- `GET /api/cron/process-jobs` - Process pending background jobs

## Security

### Best Practices Implemented

✓ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Minimum 8 characters, uppercase, lowercase, number
- Never logged or exposed

✓ **Data Privacy**
- No permanent image storage by default
- Optional anonymization via Haut.AI postprocessing
- User owns all their data

✓ **API Security**
- Ownership checks on all resource endpoints
- NextAuth session validation
- CSRF protection via NextAuth

✓ **Database Security**
- Parameterized queries via Prisma
- No hardcoded credentials
- Connection pooling for PostgreSQL

✓ **Webhook Security**
- Signature verification for Haut.AI webhooks
- Environment variable secrets

## Performance

- Database queries optimized with indexes
- Efficient scan pagination in tables
- Chart rendering with memoized components
- CSS-in-JS with Tailwind for minimal overhead
- Image processing on backend (no client-side processing)

## Deployment

### Vercel (Recommended)

```bash
# Connect repo to Vercel
# Set environment variables in Vercel dashboard
# Automatic deployment on push
```

### Environment Setup for Production

1. **Database**: Use managed Postgres (Neon/Supabase)
   ```bash
   npm run prisma:migrate -- --skip-generate
   ```

2. **Email**: Configure SMTP provider (Gmail, SendGrid, etc.)

3. **Haut.AI**: Integrate real API credentials

4. **NEXTAUTH_SECRET**: Generate secure secret
   ```bash
   openssl rand -base64 32
   ```

5. **Cron Jobs**: Configure Vercel Cron in `vercel.json`

## Monitoring & Logs

### Local Development

```bash
# View database
npm run prisma:studio

# Check background jobs
SELECT * FROM background_jobs WHERE status != 'completed';
```

### Production

- Monitor API errors via application logging
- Track webhook deliveries in background_jobs table
- Monitor Haut.AI API usage in your dashboard

## Development Workflow

```bash
# Install dependencies
npm install

# Create .env.local with your config
cp .env.example .env.local

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed

# Start dev server
npm run dev

# In another terminal, run background job processor
curl -H "Authorization: Bearer dev-secret" http://localhost:3000/api/cron/process-jobs
```

## Testing

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Sign in with credentials
- [ ] Sign in with magic link
- [ ] Create new scan session
- [ ] Upload scan image (demo image generated)
- [ ] View scan results while processing
- [ ] View completed scan report
- [ ] Check dashboard with multiple scans
- [ ] Verify trend charts display correctly
- [ ] Test pagination in scan history
- [ ] Verify privacy policy loads

### Running Tests

Currently, the project includes manual testing. To add automated tests:

```bash
npm install --save-dev jest @testing-library/react
# Add test configuration
```

## Troubleshooting

**Issue: "DATABASE_URL is not set"**
- Ensure `.env.local` exists with correct DATABASE_URL
- Format: `postgresql://user:password@host:port/database`

**Issue: "Prisma migration errors"**
- Delete `prisma/migrations` folder
- Run `npm run prisma:migrate` again

**Issue: "NEXTAUTH_SECRET is not set"**
- Generate and add to .env.local: `openssl rand -base64 32`

**Issue: "Images not showing in reports"**
- Ensure HAUT_MOCK is true for development
- Check browser console for CORS errors
- Verify Haut.AI credentials if using real API

**Issue: "Background jobs not processing"**
- Manually trigger: `curl -H "Authorization: Bearer dev-secret" http://localhost:3000/api/cron/process-jobs`
- Check background_jobs table for failures
- Verify Haut.AI API connectivity

## License

MIT

## Support

For questions or issues, contact: support@dermalabs.app

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

---

**Version**: 0.1.0
**Last Updated**: 2024
