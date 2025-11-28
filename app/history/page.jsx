'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import Link from 'next/link'

export default function HistoryPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.email) {
      alert('❌ Vui lòng đăng nhập!')
      router.push('/login')
      return
    }
    setUser(userData)
    loadOrders()
  }, [])

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(savedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    }
    return texts[status] || 'Chờ xác nhận'
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      banking: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      card: 'Thẻ tín dụng'
    }
    return methods[method] || 'Thanh toán khi nhận hàng'
  }

  const getShippingMethodText = (method) => {
    const methods = {
      standard: 'Giao hàng tiêu chuẩn',
      express: 'Giao hàng nhanh',
      scheduled: 'Giao hàng theo giờ'
    }
    return methods[method] || 'Giao hàng tiêu chuẩn'
  }

  const cancelOrder = (orderId) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return

    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    )
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
    alert('✅ Đã hủy đơn hàng!')
  }

  const reorder = (order) => {
    if (confirm('Thêm lại các sản phẩm này vào giỏ hàng?')) {
      order.items.forEach(item => {
        dispatch(addToCart(item.product))
      })
      alert('✅ Đã thêm sản phẩm vào giỏ hàng!')
      router.push('/cart')
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-green-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Bộ lọc */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">Bộ lọc</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'all' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Tất cả ({orders.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Chờ xác nhận ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilterStatus('processing')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'processing' 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Đang xử lý ({orders.filter(o => o.status === 'processing').length})
                </button>
                <button
                  onClick={() => setFilterStatus('shipping')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'shipping' 
                      ? 'bg-purple-100 text-purple-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Đang giao ({orders.filter(o => o.status === 'shipping').length})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'completed' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Hoàn thành ({orders.filter(o => o.status === 'completed').length})
                </button>
                <button
                  onClick={() => setFilterStatus('cancelled')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    filterStatus === 'cancelled' 
                      ? 'bg-red-100 text-red-800 font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Đã hủy ({orders.filter(o => o.status === 'cancelled').length})
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Link 
                  href="/products"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="lg:col-span-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có đơn hàng</h2>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? 'Bạn chưa có đơn hàng nào' 
                    : `Không có đơn hàng ${getStatusText(filterStatus).toLowerCase()}`}
                </p>
                <Link 
                  href="/products"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Mã đơn hàng</div>
                          <div className="font-semibold text-gray-800">
                            #{String(order.id).slice(-8)}
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div>
                          <div className="text-sm text-gray-500">Ngày đặt</div>
                          <div className="font-medium text-gray-800">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <img 
                              src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{item.product.title}</div>
                              <div className="text-sm text-gray-500">Số lượng: {item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                {(item.product.price * 24000 * item.quantity).toLocaleString('vi-VN')}₫
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Thanh toán:</span> {getPaymentMethodText(order.paymentMethod)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Vận chuyển:</span> {getShippingMethodText(order.shippingMethod)}
                          </div>
                          {order.discount > 0 && (
                            <div className="text-sm text-red-600">
                              <span className="font-medium">Giảm giá:</span> -{order.discount.toLocaleString('vi-VN')}₫
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Tổng cộng:</div>
                          <div className="text-2xl font-bold text-green-600">
                            {order.total.toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                        >
                          Chi tiết
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-medium"
                          >
                            Hủy đơn
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <button
                            onClick={() => reorder(order)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
                          >
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Mã đơn hàng</div>
                    <div className="font-semibold">#{String(selectedOrder.id).slice(-8)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ngày đặt</div>
                    <div className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tổng tiền</div>
                    <div className="font-bold text-green-600">{selectedOrder.total.toLocaleString('vi-VN')}₫</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Thông tin người nhận</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Họ tên:</span> <span className="font-medium">{selectedOrder.customerInfo?.fullName}</span></div>
                    <div><span className="text-gray-600">Số điện thoại:</span> <span className="font-medium">{selectedOrder.customerInfo?.phone}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedOrder.customerInfo?.email}</span></div>
                    <div><span className="text-gray-600">Địa chỉ:</span> <span className="font-medium">{selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.district}, {selectedOrder.customerInfo?.city}</span></div>
                    {selectedOrder.customerInfo?.note && (
                      <div><span className="text-gray-600">Ghi chú:</span> <span className="font-medium">{selectedOrder.customerInfo.note}</span></div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Sản phẩm</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <img src={item.product.images?.[0]} alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <div className="font-medium">{item.product.title}</div>
                          <div className="text-sm text-gray-600">SL: {item.quantity} × {(item.product.price * 24000).toLocaleString('vi-VN')}₫</div>
                        </div>
                        <div className="font-semibold text-green-600">
                          {(item.product.price * 24000 * item.quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>{selectedOrder.subtotal?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>{selectedOrder.shippingFee?.toLocaleString('vi-VN')}₫</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Giảm giá:</span>
                        <span>-{selectedOrder.discount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">{selectedOrder.total?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}