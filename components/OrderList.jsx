'use client';
import { useEffect, useState } from 'react';
export default function OrderList(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ const raw=localStorage.getItem('orders'); setOrders(raw?JSON.parse(raw):[]) },[]);
  if(orders.length===0) return <p>Chưa có đơn hàng nào</p>;
  return (<div className="space-y-3">{orders.map(o=>(
    <div key={o.id} className="card">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">Đơn #{o.id}</div>
          <div className="text-sm text-gray-600">Người nhận: {o.name}</div>
          <div className="text-sm text-gray-600">Địa chỉ: {o.address}</div>
        </div>
        <div className="text-right"><div className="font-semibold">{o.total.toFixed(2)} $</div><div className="text-sm text-gray-600">{o.items.length} sản phẩm</div></div>
      </div>
    </div>
  ))}</div>);
}
