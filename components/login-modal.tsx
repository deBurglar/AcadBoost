"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Lock, CheckCircle } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onLogin(data.user)
          onClose()
          setSuccess(false)
        }, 1500)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    { role: 'Admin', email: 'sarah.johnson@edu.com', color: 'bg-blue-100 text-blue-700' },
    { role: 'Faculty', email: 'michael.chen@edu.com', color: 'bg-green-100 text-green-700' },
    { role: 'Student', email: 'john.smith@student.edu.com', color: 'bg-purple-100 text-purple-700' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {success ? <CheckCircle className="w-5 h-5 text-green-600" /> : <User className="w-5 h-5" />}
            {success ? 'Login Successful!' : 'Login to EduSchedule Pro'}
          </CardTitle>
          <CardDescription>
            {success ? 'Redirecting to dashboard...' : 'Access your personalized dashboard'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">Welcome back!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Demo Credentials:</h3>
                {demoCredentials.map((cred) => (
                  <div key={cred.role} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <Badge className={cred.color}>{cred.role}</Badge>
                    <button
                      onClick={() => setEmail(cred.email)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {cred.email}
                    </button>
                  </div>
                ))}
                <p className="text-xs text-gray-500">Password: demo123</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
