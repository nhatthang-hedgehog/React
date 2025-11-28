'use client'

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import Link from 'next/link'

export default function ProductsPage() {
  const dispatch = useDispatch()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('grid')
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      localStorage.setItem('lastSearch', searchTerm)
    }
  }, [searchTerm])

  useEffect(() => {
    const lastSearch = localStorage.getItem('lastSearch')
    if (lastSearch) {
      setSearchTerm(lastSearch)
    }
  }, [])

  useEffect(() => {
    document.title = `Sản phẩm (${filteredProducts.length}) - Fruit Shop`
  }, [searchTerm, selectedCategory, priceRange])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products?offset=0&limit=100')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const cats = [
        { id: 1, name: 'Trái cây nhiệt đới' },
        { id: 2, name: 'Trái cây ôn đới' },
        { id: 3, name: 'Trái cây cao cấp' }
      ]
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // ========== Lọc sản phẩm ==========
  const filteredProducts = products.filter(product => {
    const matchSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'all' || product.category?.name === selectedCategory
    
    const price = product.price * 24000
    let matchPrice = true
    if (priceRange === 'under100k') matchPrice = price < 100000
    else if (priceRange === '100k-300k') matchPrice = price >= 100000 && price < 300000
    else if (priceRange === '300k-500k') matchPrice = price >= 300000 && price < 500000
    else if (priceRange === 'over500k') matchPrice = price >= 500000
    
    return matchSearch && matchCategory && matchPrice
  })

  // ========== Sắp xếp sản phẩm ==========
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title)
    if (sortBy === 'name-desc') return b.title.localeCompare(a.title)
    return 0
  })

  // ========== Phân trang ==========
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleQuickAdd = (product) => {
    dispatch(addToCart(product))
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = '✅ Đã thêm vào giỏ hàng!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setPriceRange('all')
    setSortBy('default')
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sản phẩm</h1>
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-green-600">{filteredProducts.length}</span> sản phẩm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tất cả giá</option>
                <option value="under100k">Dưới 100.000₫</option>
                <option value="100k-300k">100.000₫ - 300.000₫</option>
                <option value="300k-500k">300.000₫ - 500.000₫</option>
                <option value="over500k">Trên 500.000₫</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>

              {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button
              onClick={resetFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          -14%
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">
                          {product.category?.name || 'Trái cây'}
                        </span>
                      </div>

                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition min-h-[3rem]">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(5)}
                        </div>
                        <span className="text-xs text-gray-500">(128)</span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-green-600 font-bold text-lg">
                          {(product.price * 24000).toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-gray-400 text-sm line-through">
                          {(product.price * 28000).toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickAdd(product)}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-medium transition text-sm"
                        >
                          Thêm vào giỏ
                        </button>
                        <Link 
                          href={`/products/${product.id}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition"
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

            {viewMode === 'list' && (
              <div className="space-y-4">
                {paginatedProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex"
                  >
                    <Link href={`/products/${product.id}`} className="flex-shrink-0">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-48 h-48 object-cover"
                      />
                    </Link>

                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="mb-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {product.category?.name || 'Trái cây'}
                          </span>
                        </div>

                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-bold text-xl text-gray-800 mb-2 hover:text-green-600 transition">
                            {product.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(5)}
                          </div>
                          <span className="text-sm text-gray-500">(128 đánh giá)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-green-600 font-bold text-2xl">
                            {(product.price * 24000).toLocaleString('vi-VN')}₫
                          </span>
                          <span className="text-gray-400 line-through">
                            {(product.price * 28000).toLocaleString('vi-VN')}₫
                          </span>
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            -14%
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                          >
                            Thêm vào giỏ
                          </button>
                          <Link 
                            href={`/products/${product.id}`}
                            className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg font-medium transition"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Trước
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === index + 1
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}