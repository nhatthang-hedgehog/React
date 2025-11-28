'use client';
import { useCart } from '../context/CartContext';

export default function ProductDetailClient({ product }) {
  const { dispatch } = useCart();
  return (
    <div className="card max-w-3xl">
      <div className="flex gap-6">
        <div style={{minWidth:320}}>
          <img src={product.images?.[0]} alt={product.title} className="product-img" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-sm text-gray-600 mt-2">{product.description}</p>
          <div className="mt-4">
            <div className="price">{product.price} $</div>
            <button onClick={()=>dispatch({type:'add', product, quantity:1})} className="mt-3 px-4 py-2 bg-green-700 text-white rounded">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
