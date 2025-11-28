'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from './redux/cartSlice'
import Link from 'next/link'
import { motion } from "framer-motion";


export default function Home() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=8')
        const data = await res.json()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = '✅ Đã thêm vào giỏ hàng!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const featured = products.slice(0, 8)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner khuyến mãi lớn */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white overflow-hidden w-full py-20">
  <div className="px-4 md:px-8 lg:px-16 relative z-10">
    <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-5xl font-bold mb-4">TRÁI CÂY TƯƠI NGON</h1>
        <p className="text-4xl font-bold mb-2">GIẢM GIÁ SỐC</p>
        <p className="text-7xl font-bold text-yellow-300 mb-6">35%</p>
        <p className="text-2xl mb-6">CHO ĐƠN HÀNG ĐẦU TIÊN</p>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Link href="/products">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-full text-lg transition">
              Mua ngay
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative"
      >
        <img
          src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600"
          alt="Fresh Fruits"
          className="w-full rounded-lg shadow-2xl"
        />
      </motion.div>
    </div>
  </div>

  {/* Decorative */}
  <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
    <svg viewBox="0 0 100 100" className="text-yellow-300 fill-current">
      <circle cx="50" cy="50" r="40" />
    </svg>
  </div>
</section>
      {/* Sản phẩm Trái Cây */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">TRÁI CÂY NỔI BẬT</h2>
              <div className="h-1 w-24 bg-green-600"></div>
            </div>
            <Link 
              href="/products"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
            >
              Xem tất cả
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product, idx) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group relative">
                  {/* Badge giảm giá */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10">
                    -14%
                  </div>
                  
                  <Link href={`/products/${product.id}`}>
                    <div className="relative overflow-hidden bg-gray-50">
                      <img 
                        src={product.images?.[0]} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    {/* Danh mục */}
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">
                        {product.category?.name || 'Trái cây'}
                      </span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] hover:text-green-600 transition">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-green-600 font-bold text-lg">
                        {(product.price * 24000).toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-gray-400 text-sm line-through">
                        {(product.price * 28000).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-gray-500 text-xs">(128)</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Thêm vào giỏ
                      </button>
                      <Link 
                        href={`/products/${product.id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Danh mục sản phẩm */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-2">DANH MỤC SẢN PHẨM</h2>
            <div className="h-1 w-24 bg-green-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/products?category=Trái cây nhiệt đới">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-8 text-center hover:shadow-xl transition cursor-pointer group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition">🌴</div>
                <h3 className="text-2xl font-bold text-orange-800 mb-2">Trái cây nhiệt đới</h3>
                <p className="text-gray-600">Xoài, Sầu riêng, Thanh long...</p>
              </div>
            </Link>

            <Link href="/products?category=Trái cây ôn đới">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 text-center hover:shadow-xl transition cursor-pointer group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition">🍎</div>
                <h3 className="text-2xl font-bold text-blue-800 mb-2">Trái cây ôn đới</h3>
                <p className="text-gray-600">Táo, Nho, Lê...</p>
              </div>
            </Link>

            <Link href="/products?category=Trái cây cao cấp">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 text-center hover:shadow-xl transition cursor-pointer group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition">💎</div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">Trái cây cao cấp</h3>
                <p className="text-gray-600">Cherry, Dâu tây, Sầu riêng...</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">TÍCH ĐIỂM DỄ DÀNG - ƯU ĐÃI RỘN RÀNG</h2>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 text-green-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                🎁
              </div>
              <span className="text-lg font-medium">QUÀ TẶNG ĐỘC QUYỀN</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 text-green-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                10%
              </div>
              <span className="text-lg font-medium">GIẢM GIÁ LÊN ĐẾN 10%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 text-green-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold">
                🎂
              </div>
              <span className="text-lg font-medium">QUÀ TẶNG SINH NHẬT</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/products">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-full text-lg transition">
                Khám phá ngay
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-2">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
            <div className="h-1 w-24 bg-green-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Trái cây rất tươi ngon, giao hàng nhanh chóng. Tôi rất hài lòng với chất lượng sản phẩm!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  N
                </div>
                <div>
                  <p className="font-semibold">Nguyễn Văn A</p>
                  <p className="text-sm text-gray-500">Hà Nội</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Shop phục vụ rất tận tình, trái cây đóng gói cẩn thận. Mình sẽ tiếp tục ủng hộ!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <p className="font-semibold">Trần Thị B</p>
                  <p className="text-sm text-gray-500">TP. HCM</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex text-yellow-400 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Giá cả hợp lý, chất lượng tốt. Đặc biệt là xoài Hòa Lộc rất ngon và thơm!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  L
                </div>
                <div>
                  <p className="font-semibold">Lê Văn C</p>
                  <p className="text-sm text-gray-500">Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}