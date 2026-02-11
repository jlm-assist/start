import { NextAuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createTransport } from 'nodemailer'

const emailClient = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@dermalabs.app',
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider,
        theme,
      }) => {
        const { host } = new URL(url)
        const result = await emailClient.sendMail({
          to: email,
          from: process.env.EMAIL_FROM || 'noreply@dermalabs.app',
          subject: 'Sign in to DermaLabs SkinScan',
          html: emailSignInTemplate(url, email, host),
        })
        if (result.error) {
          throw new Error('Failed to send verification email')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-email',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

function emailSignInTemplate(url: string, email: string, host: string) {
  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0066cc; font-size: 24px; margin-bottom: 20px;">DermaLabs SkinScan</h1>
        <p>Hello,</p>
        <p>Click the link below to sign in to your DermaLabs account:</p>
        <div style="margin: 30px 0;">
          <a href="${url}" style="display: inline-block; padding: 12px 32px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Sign In
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${url}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
        <p style="color: #999; font-size: 12px;">
          This link expires in 24 hours. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `
}
