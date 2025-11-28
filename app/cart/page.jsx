'use client'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart, clearCart } from '../redux/cartSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  // Tính tổng tiền
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price * 24000 * item.quantity), 0
  )
  const shippingFee = 30000
  const total = subtotal + shippingFee

  // Cập nhật số lượng
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ productId, quantity: newQuantity }))
  }

  // Xóa sản phẩm
  const handleRemoveItem = (productId) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      dispatch(removeFromCart(productId))
    }
  }

  // Xóa tất cả
  const handleClearCart = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      dispatch(clearCart())
    }
  }

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    router.push('/checkout')
  }

  // Modal đăng nhập
  const LoginModal = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
      e.preventDefault()
      
      if (email && password) {
        const user = { email, name: email.split('@')[0] }
        localStorage.setItem('user', JSON.stringify(user))
        setIsLoggedIn(true)
        setShowLoginModal(false)
        alert('✅ Đăng nhập thành công!')
        router.push('/checkout')
      } else {
        alert('❌ Vui lòng nhập đầy đủ thông tin')
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để tiếp tục thanh toán
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Đăng nhập
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Link 
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-1">
            Bạn có {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cột trái - Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h2 className="text-xl font-semibold">Sản phẩm</h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-4">
                {items.map(item => (
                  <div 
                    key={item.product.id} 
                    className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-300 transition"
                  >
                    {/* Hình ảnh sản phẩm */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.product.images?.[0]} 
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.product.category?.name || 'Trái cây'}
                      </p>
                      
                      {/* Giá */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-green-600 font-bold text-lg">
                          {(item.product.price * 24000).toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-gray-400 text-sm line-through">
                          {(item.product.price * 28000).toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {/* Điều khiển số lượng */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-semibold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-semibold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Tổng tiền sản phẩm */}
                    <div className="flex-shrink-0 text-right">
                      <div className="font-bold text-lg text-green-600">
                        {(item.product.price * 24000 * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút tiếp tục mua sắm */}
              <div className="mt-6 pt-6 border-t">
                <Link 
                  href="/products"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>

          {/* Cột phải - Tổng đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>

              {/* Chi tiết giá */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-medium">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              {/* Tổng cộng */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-2xl font-bold text-green-600">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Thông báo đăng nhập */}
              {!isLoggedIn && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Vui lòng đăng nhập để tiếp tục thanh toán
                  </p>
                </div>
              )}

              {/* Nút thanh toán */}
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl mb-3"
              >
                {isLoggedIn ? 'Thanh toán ngay' : 'Đăng nhập để thanh toán'}
              </button>

              {/* Chính sách */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Miễn phí giao hàng với đơn từ 500.000₫</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Đổi trả trong vòng 24h nếu có vấn đề</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>

              {/* Khuyến mãi */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3 text-gray-800">🎁 Ưu đãi đặc biệt</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <p className="text-green-800 font-medium">Mua 3 tặng 1 - Kem Gelato</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <p className="text-green-800 font-medium">Giảm 10% cho đơn hàng đầu tiên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đăng nhập */}
      {showLoginModal && <LoginModal />}
    </div>
  )
}