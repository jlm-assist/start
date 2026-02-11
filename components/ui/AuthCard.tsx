interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && (
          <p className="text-gray-600 mb-6 text-sm">{description}</p>
        )}
        {children}
      </div>
    </div>
  )
}
