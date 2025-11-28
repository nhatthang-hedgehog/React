// components/Nav.jsx
'use client'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export default function Nav() {
  const items = useSelector(state => state.cart.items)
  const total = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className="container mt-4 mb-4">
      <div className="flex items-center gap-4">
        <form action="/products" method="get" className="flex-1">
          <input
            name="q"
            placeholder="Tìm trái cây, nông sản..."
            className="w-full border rounded p-2"
          />
        </form>
        <Link href="/cart" className="px-3 py-2 rounded border text-sm">
          Giỏ ({total})
        </Link>
      </div>
    </nav>
  )
}
