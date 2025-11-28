'use client';

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ product: {...}, quantity: number }]
  },
  reducers: {
    // Khởi tạo cart từ localStorage
    initCart(state, action) {
      const savedCart = action.payload;
      if (savedCart && savedCart.items) {
        state.items = savedCart.items;
      }
    },

    // Thêm sản phẩm vào giỏ
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({
          product,
          quantity: 1,
        });
      }
    },

    // Cập nhật số lượng
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },

    // Xóa sản phẩm
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  initCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;