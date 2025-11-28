'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/cartSlice'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      const data = await res.json()
      setProduct(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching product:', error)
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = `✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product))
    }
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-green-600">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/products" className="text-gray-600 hover:text-green-600">Sản phẩm</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cột trái - Hình ảnh */}
            <div>
              {/* Ảnh chính */}
              <div className="mb-4">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Ảnh thu nhỏ */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {/* Danh mục */}
              <div className="mb-2">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category?.name || 'Trái cây'}
                </span>
              </div>

              {/* Tên sản phẩm */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.title}
              </h1>

              {/* Đánh giá */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="text-gray-600 text-sm">(128 đánh giá)</span>
              </div>

              {/* Giá */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    {(product.price * 24000).toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {(product.price * 28000).toLocaleString('vi-VN')}₫
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    -14%
                  </span>
                </div>
              </div>

              {/* Mô tả */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm:</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Số lượng */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-semibold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-gray-300 py-2 font-medium"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Mua ngay
                </button>
              </div>

              {/* Thông tin bổ sung */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Miễn phí giao hàng cho đơn từ 500.000₫</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Đổi trả trong vòng 24h nếu có vấn đề</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Sản phẩm tươi ngon, được chọn lọc kỹ càng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phần mô tả chi tiết */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết sản phẩm</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Thông tin sản phẩm</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between py-2 border-b">
                    <span>Danh mục:</span>
                    <span className="font-medium">{product.category?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Xuất xứ:</span>
                    <span className="font-medium">{product.origin || 'Nhập khẩu'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Đơn vị:</span>
                    <span className="font-medium">{product.unit || '1kg'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Bảo quản:</span>
                    <span className="font-medium">Nơi khô ráo, thoáng mát</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Lợi ích sức khỏe</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Giàu vitamin và khoáng chất thiết yếu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Tăng cường hệ miễn dịch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Hỗ trợ tiêu hóa và làm đẹp da</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Chất chống oxy hóa mạnh mẽ</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Thông tin dinh dưỡng */}
            {product.nutrition && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Thông tin dinh dưỡng (100g)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.nutrition.calories && (
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {product.nutrition.calories}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Calo</div>
                    </div>
                  )}
                  {product.nutrition.vitamin_c && (
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {product.nutrition.vitamin_c}mg
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Vitamin C</div>
                    </div>
                  )}
                  {product.nutrition.fiber && (
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {product.nutrition.fiber}g
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Chất xơ</div>
                    </div>
                  )}
                  {product.nutrition.potassium && (
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {product.nutrition.potassium}mg
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Kali</div>
                    </div>
                  )}
                  {product.nutrition.sugar && (
                    <div className="bg-pink-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-pink-600">
                        {product.nutrition.sugar}g
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Đường</div>
                    </div>
                  )}
                  {product.nutrition.vitamin_a && (
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        {product.nutrition.vitamin_a}µg
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Vitamin A</div>
                    </div>
                  )}
                  {product.nutrition.vitamin_b6 && (
                    <div className="bg-indigo-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {product.nutrition.vitamin_b6}mg
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Vitamin B6</div>
                    </div>
                  )}
                  {product.nutrition.water && (
                    <div className="bg-cyan-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-cyan-600">
                        {product.nutrition.water}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Nước</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        <RelatedProducts currentProductId={product.id} categoryName={product.category?.name} />
      </div>
    </div>
  )
}

// Component Sản phẩm liên quan
function RelatedProducts({ currentProductId, categoryName }) {
  const [products, setProducts] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (categoryName) {
      fetchRelatedProducts()
    }
  }, [categoryName])

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`/api/products?category=${categoryName}&limit=20`)
      const data = await res.json()
      // Lọc bỏ sản phẩm hiện tại
      const filtered = data.filter(p => p.id !== currentProductId)
      setProducts(filtered.slice(0, 4))
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleQuickAdd = (product) => {
    dispatch(addToCart(product))
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = '✅ Đã thêm vào giỏ hàng!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  if (products.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <Link href={`/products/${product.id}`}>
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600">
                  {product.title}
                </h3>
              </Link>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-green-600 font-bold">
                  {(product.price * 24000).toLocaleString('vi-VN')}₫
                </span>
                <span className="text-gray-400 text-sm line-through">
                  {(product.price * 28000).toLocaleString('vi-VN')}₫
                </span>
              </div>
              <button
                onClick={() => handleQuickAdd(product)}
                className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-medium transition text-sm"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}