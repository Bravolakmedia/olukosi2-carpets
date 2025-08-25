"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Shield, Lock, User, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function AdminLoginClient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  // Demo admin credentials - replace with actual authentication
  const DEMO_ADMINS = [
    {
      email: "admin@olukosicarpets.com",
      password: "admin123",
      role: "Super Admin",
      name: "System Administrator",
    },
    {
      email: "manager@olukosicarpets.com",
      password: "manager123",
      role: "Manager",
      name: "Store Manager",
    },
  ]

  // Check for existing lockout on component mount
  useEffect(() => {
    const lockoutData = localStorage.getItem("adminLockout")
    if (lockoutData) {
      const { lockoutUntil, attempts } = JSON.parse(lockoutData)
      const now = Date.now()

      if (now < lockoutUntil) {
        setIsLocked(true)
        setLockoutTime(Math.ceil((lockoutUntil - now) / 1000))
        setLoginAttempts(attempts)

        // Start countdown timer
        const timer = setInterval(() => {
          setLockoutTime((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              setIsLocked(false)
              setLoginAttempts(0)
              localStorage.removeItem("adminLockout")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } else {
        // Lockout expired
        localStorage.removeItem("adminLockout")
        setLoginAttempts(attempts)
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      setError(`Account locked. Please try again in ${Math.ceil(lockoutTime / 60)} minutes.`)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo authentication - replace with actual API call
      const admin = DEMO_ADMINS.find((a) => a.email === formData.email && a.password === formData.password)

      if (admin) {
        // Successful login
        const authData = {
          isAuthenticated: true,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          loginTime: Date.now(),
          rememberMe: formData.rememberMe,
        }

        localStorage.setItem("adminAuth", JSON.stringify(authData))
        localStorage.removeItem("adminLockout")

        // Reset login attempts on successful login
        setLoginAttempts(0)

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      } else {
        // Failed login
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (newAttempts >= 5) {
          // Lock account for 15 minutes after 5 failed attempts
          const lockoutUntil = Date.now() + 15 * 60 * 1000
          localStorage.setItem(
            "adminLockout",
            JSON.stringify({
              lockoutUntil,
              attempts: newAttempts,
            }),
          )

          setIsLocked(true)
          setLockoutTime(15 * 60) // 15 minutes in seconds
          setError("Too many failed attempts. Account locked for 15 minutes.")

          // Start countdown timer
          const timer = setInterval(() => {
            setLockoutTime((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                setIsLocked(false)
                setLoginAttempts(0)
                localStorage.removeItem("adminLockout")
                return 0
              }
              return prev - 1
            })
          }, 1000)
        } else {
          setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`)
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setResetSent(true)
    setIsLoading(false)

    // Reset form after 5 seconds
    setTimeout(() => {
      setShowForgotPassword(false)
      setResetSent(false)
      setResetEmail("")
    }, 5000)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-gray-900 to-navy-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setShowForgotPassword(false)} className="p-0 h-auto">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <p className="text-sm text-gray-600 text-center">
                Enter your email address and we'll send you a reset link
              </p>
            </CardHeader>
            <CardContent>
              {resetSent ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Password reset instructions have been sent to your email address.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="Enter your admin email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-gray-900 to-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300">Secure access to Olukosi Carpets management</p>
          <Badge variant="secondary" className="mt-2">
            <KeyRound className="h-3 w-3 mr-1" />
            Secure Login
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Administrator Sign In</CardTitle>
            <p className="text-sm text-gray-600 text-center">Enter your credentials to access the admin dashboard</p>
          </CardHeader>
          <CardContent>
            {/* Demo Credentials Info */}
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo Credentials:</strong>
                <br />
                <div className="mt-2 space-y-1 text-xs">
                  <div>Super Admin: admin@olukosicarpets.com / admin123</div>
                  <div>Manager: manager@olukosicarpets.com / manager123</div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Lockout Timer */}
            {isLocked && (
              <Alert className="mb-6 bg-orange-50 border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Account locked for security. Time remaining: <strong>{formatTime(lockoutTime)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@olukosicarpets.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={isLocked}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-12 h-12"
                    required
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLocked}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    disabled={isLocked}
                  />
                  <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-rose-600 hover:text-rose-700 hover:underline transition-colors"
                  disabled={isLocked}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 font-semibold"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : isLocked ? (
                  `Locked (${formatTime(lockoutTime)})`
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Sign In Securely
                  </>
                )}
              </Button>
            </form>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <Alert className="mt-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Security Warning:</strong> {loginAttempts} failed attempt{loginAttempts > 1 ? "s" : ""}.{" "}
                  {5 - loginAttempts} attempt{5 - loginAttempts > 1 ? "s" : ""} remaining before 15-minute lockout.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="mt-6 bg-gray-50/90 border-gray-200 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security & Protection
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Brute force protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Session management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Activity monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-gray-400 text-sm">
            Need technical support?{" "}
            <a href="mailto:support@olukosicarpets.com" className="text-rose-400 hover:text-rose-300 transition-colors">
              Contact IT Support
            </a>
          </p>
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  )
}
