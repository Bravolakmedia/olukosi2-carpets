'use client'

import { useFetchOrders } from '@/hooks/useFetchOrder'
import { Button } from '@/components/ui/button'

export default function AdminOrdersPage() {
  const { orders, error, loading } = useFetchOrders({ limit: 10 })

  if (loading) return <p>Loading orders…</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin: Customer Orders</h2>

      <table className="w-full table-auto border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Customer ID</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="px-4 py-2">{o.id}</td>
              {o.order_items.map(item => (
              <>
              <td className="px-4 py-2">{o.customer_id}</td>
              <td className="px-4 py-2">{item.product.name}</td>
              <td className="px-4 py-2">{item.product.quantity}</td>
              <td className="px-4 py-2">₦{item.product.total_price}</td>
              <td className="px-4 py-2">{o.status}</td>
              </>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
