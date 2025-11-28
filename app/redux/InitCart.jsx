'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initCart } from './cartSlice';

export default function InitCart({ children }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Load cart từ localStorage khi app khởi động
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch(initCart(JSON.parse(savedCart)));
    }
  }, [dispatch]);

  // Lưu cart vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return <>{children}</>;
}