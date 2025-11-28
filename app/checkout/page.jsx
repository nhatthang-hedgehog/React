'use client'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../redux/cartSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const router = useRouter()
  
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod',
  })
  const [loading, setLoading] = useState(false)

  // Kiểm tra đăng nhập
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      alert('⚠️ Vui lòng đăng nhập để tiếp tục!')
      router.push('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData(prev => ({
      ...prev,
      email: parsedUser.email || '',
      fullName: parsedUser.name || '',
    }))
  }, [router])

  // Kiểm tra giỏ hàng
  useEffect(() => {
    if (items.length === 0) {
      alert('⚠️ Giỏ hàng của bạn đang trống!')
      router.push('/products')
    }
  }, [items, router])

  // Tính tổng tiền
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price * 24000 * item.quantity), 0
  )
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const discount = 0
  const total = subtotal + shippingFee - discount

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Xử lý đặt hàng
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('❌ Vui lòng điền đầy đủ thông tin!')
      return
    }

    setLoading(true)

    try {
      // Tạo đơn hàng
      const order = {
  id: Date.now().toString(), // Chuyển thành string
  items: items,
  customerInfo: formData, // Đổi tên từ 'customer' thành 'customerInfo'
  paymentMethod: formData.paymentMethod,
  shippingMethod: 'standard', // Thêm phương thức vận chuyển
  subtotal,
  shippingFee,
  discount,
  total,
  status: 'pending',
  createdAt: new Date().toISOString(),
}

      // Lưu vào localStorage (thay bằng API thực tế)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.unshift(order)
      localStorage.setItem('orders', JSON.stringify(orders))

      // Xóa giỏ hàng
      dispatch(clearCart())

      // Chuyển đến trang thành công
      setTimeout(() => {
        setLoading(false)
        alert('✅ Đặt hàng thành công!')
        router.push('/history')
      }, 1500)

    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
      alert('❌ Có lỗi xảy ra. Vui lòng thử lại!')
    }
  }

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Thanh toán</h1>
          <p className="text-gray-600 mt-1">
            Vui lòng kiểm tra thông tin và hoàn tất đơn hàng
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cột trái - Form thông tin */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912345678"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 2">Quận 2</option>
                      <option value="Quận 3">Quận 3</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ cụ thể <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (Tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="Ghi chú thêm về đơn hàng..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={formData.paymentMethod === 'banking'}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">Chuyển khoản qua Vietcombank, VietinBank, ACB...</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 transition opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="momo"
                      disabled
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">Ví MoMo</div>
                      <div className="text-sm text-gray-500">Tính năng đang phát triển</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Cột phải - Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

                {/* Danh sách sản phẩm */}
                <div className="space-y-3 mb-4 pb-4 border-b max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-green-600 font-semibold">
                          {(item.product.price * 24000).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chi tiết giá */}
                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        `${shippingFee.toLocaleString('vi-VN')}₫`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span className="font-medium">-{discount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                </div>

                {/* Tổng cộng */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {/* Nút đặt hàng */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl mb-3"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Đặt hàng'
                  )}
                </button>

                <Link 
                  href="/cart"
                  className="block text-center text-green-600 hover:text-green-700 font-medium"
                >
                  ← Quay lại giỏ hàng
                </Link>

                {/* Lưu ý */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Bằng việc đặt hàng, bạn đồng ý với{' '}
                    <a href="#" className="text-green-600">Điều khoản sử dụng</a>
                    {' '}của chúng tôi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}