'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (!res.ok) {
        setIsLoading(false)
        alert('❌ Đăng nhập thất bại! Email hoặc mật khẩu không đúng.')
        setErrors({ 
          email: 'Thông tin đăng nhập không chính xác', 
          password: ' ' 
        })
        return
      }

      const data = await res.json()

      // Lưu token
      const token = data.access_token || data.token || JSON.stringify(data)
      localStorage.setItem('token', token)

      // Lấy thông tin user (nếu API có endpoint profile)
      try {
        const profileRes = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (profileRes.ok) {
          const userData = await profileRes.json()
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            fullName: userData.name,
            email: userData.email,
            role: userData.role || 'customer',
            avatar: userData.avatar
          }))

          // Chuyển hướng theo role
          if (userData.role === 'admin') {
            alert('🎉 Đăng nhập thành công! Chào mừng Admin.')
            router.push('/admin')
          } else {
            alert('🎉 Đăng nhập thành công!')
            router.push('/')
          }
        } else {
          // Nếu không lấy được profile, lưu thông tin cơ bản
          localStorage.setItem('user', JSON.stringify({
            email: formData.email,
            fullName: formData.email.split('@')[0],
            role: 'customer'
          }))
          alert('🎉 Đăng nhập thành công!')
          router.push('/')
        }
      } catch (profileError) {
        // Fallback nếu API profile lỗi
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          fullName: formData.email.split('@')[0],
          role: 'customer'
        }))
        alert('🎉 Đăng nhập thành công!')
        router.push('/')
      }

    } catch (error) {
      setIsLoading(false)
      alert('❌ Lỗi mạng! Vui lòng kiểm tra kết nối internet.')
      console.error('Login error:', error)
    }
  }

  // Demo accounts từ API
  const demoAccounts = [
    { 
      email: 'john@mail.com', 
      password: 'changeme', 
      note: 'Tài khoản demo từ API' 
    },
    { 
      email: 'maria@mail.com', 
      password: '12345', 
      note: 'Tài khoản demo từ API' 
    }
  ]

  const fillDemo = (email, password) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-bold text-green-600 mb-2">Tu Farm</div>
            <p className="text-gray-600">Trái cây tươi - An toàn - Chất lượng</p>
          </Link>
        </div>

        {/* Form đăng nhập */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600 mb-6">Chào mừng bạn trở lại!</p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                disabled={isLoading}
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Quên mật khẩu */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-green-600 rounded" />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút đăng nhập */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Đăng nhập với mạng xã hội */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Link đăng ký */}
            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Tài khoản demo */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-3">🔑 Tài khoản demo từ API:</h3>
          <div className="space-y-3">
            {demoAccounts.map((acc, idx) => (
              <div key={idx} className="bg-white rounded p-3 border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-gray-600">Email: <span className="font-medium text-gray-800">{acc.email}</span></div>
                    <div className="text-sm text-gray-600">Password: <span className="font-medium text-gray-800">{acc.password}</span></div>
                    <div className="text-xs text-gray-500 mt-1">{acc.note}</div>
                  </div>
                  <button
                    onClick={() => fillDemo(acc.email, acc.password)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Dùng thử
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}