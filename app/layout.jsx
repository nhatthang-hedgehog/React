import './globals.css'
import Nav from '../components/Nav'
import ReduxProviderWrapper from './redux/ReduxProviderWrapper'
import InitCart from './redux/InitCart'
import Link from 'next/link'   // <-- import Link

export const metadata = { title: 'Fruit Shop' }

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ReduxProviderWrapper>
          <InitCart>
            <header className="header">
              <div className="container flex items-center justify-between">
                <div className="logo font-bold text-xl">
                  <Link href="/">FRUIT-SHOP</Link>   {/* <-- bấm vào đây sẽ về trang chủ */}
                </div>
                <div className="flex items-center gap-4">
                  <a href="/products" className="text-sm text-gray-700">Sản phẩm</a>
                  <a href="/history" className="text-sm text-gray-700">Lịch sử</a>
                  <a href="/cart" className="text-sm text-green-700">Giỏ hàng</a>
                  <a href="/login" className="text-sm text-green-700">Đăng nhập</a>
                  <a href="/register" className="text-sm text-green-700">Đăng ký</a>
                </div>
              </div>
            </header>
            <Nav />
            <main className="container mt-6">{children}</main>
          </InitCart>
        </ReduxProviderWrapper>
      </body>
    </html>
  )
}
