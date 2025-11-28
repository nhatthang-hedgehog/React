'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    fetch('https://api.escuelajs.co/api/v1/products?limit=60')
      .then(r=>r.json()).then(setProducts).catch(()=>setProducts([]));
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p=> <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
