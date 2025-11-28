// components/ProductCard.jsx
'use client'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const items = useSelector(state => state.cart.items)
  const existing = items.find(i => i.id === product.id)
  const quantity = existing ? existing.quantity : 0

  const handleAdd = () => {
    const user = localStorage.getItem('user')
    if (!user) return alert('Vui lòng đăng nhập!')
    dispatch(addToCart(product))
    localStorage.setItem('cart', JSON.stringify([...items, { ...product, quantity: 1 }]))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Link href={`/products/${product.id}`}>
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-48 object-cover rounded cursor-pointer"
        />
      </Link>
      <h3 className="font-semibold mt-2">{product.title}</h3>
      <p className="text-green-600 font-bold">
        {(product.price * 24000).toLocaleString('vi-VN')}₫
      </p>
      <button
        onClick={handleAdd}
        className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Thêm vào giỏ ({quantity})
      </button>
    </div>
  )
}
