'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: 'https://api.lorem.space/image/face?w=640&h=480'
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 4) {
      newErrors.password = 'Mật khẩu phải có ít nhất 4 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      alert('❌ Vui lòng kiểm tra lại thông tin!')
      return
    }

    setIsLoading(true)

    try {
      // Gọi API đăng ký
      const res = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          avatar: formData.avatar
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setIsLoading(false)
        // Xử lý lỗi từ API
        if (data.message && Array.isArray(data.message)) {
          alert('❌ ' + data.message.join(', '))
        } else if (data.message) {
          alert('❌ ' + data.message)
        } else {
          alert('❌ Đăng ký thất bại! Email có thể đã được sử dụng.')
        }
        return
      }

      // Đăng ký thành công, tự động đăng nhập
      try {
        const loginRes = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        if (loginRes.ok) {
          const loginData = await loginRes.json()
          const token = loginData.access_token || loginData.token
          localStorage.setItem('token', token)

          // Lấy profile
          const profileRes = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
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
          }

          alert('🎉 Đăng ký thành công! Chào mừng bạn đến với Tu Farm.')
          router.push('/')
        } else {
          alert('✅ Đăng ký thành công! Vui lòng đăng nhập.')
          router.push('/login')
        }
      } catch (loginError) {
        alert('✅ Đăng ký thành công! Vui lòng đăng nhập.')
        router.push('/login')
      }

    } catch (error) {
      setIsLoading(false)
      alert('❌ Lỗi mạng! Vui lòng kiểm tra kết nối internet.')
      console.error('Register error:', error)
    }
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

        {/* Form đăng ký */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600 mb-6">Tạo tài khoản để trải nghiệm mua sắm</p>

          <div className="space-y-4">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Nút đăng ký */}
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
                  Đang đăng ký...
                </span>
              ) : (
                'Đăng ký'
              )}
            </button>

            {/* Link đăng nhập */}
            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Chính sách */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="text-green-600 hover:underline">
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link href="/privacy" className="text-green-600 hover:underline">
            Chính sách bảo mật
          </Link>{' '}
          của Tu Farm
        </p>

        {/* Thông tin API */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Lưu ý:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Mật khẩu tối thiểu 4 ký tự</li>
            <li>• Email phải hợp lệ và chưa được đăng ký</li>
            <li>• Sau khi đăng ký thành công, bạn sẽ tự động đăng nhập</li>
          </ul>
        </div>
      </div>
    </div>
  )
}