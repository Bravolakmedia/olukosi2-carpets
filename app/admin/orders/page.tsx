"use client"

import React from "react"
import { useFetchOrders, OrderWithItems } from "@/hooks/useFetchOrder"

export default function OrdersPage() {
  const { orders, loading, error } = useFetchOrders({ limit: 10, offset: 0 })

  if (loading) return <p>Loading orders…</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: OrderWithItems) => {
            // compute total for this order
            const totalPrice = order.order_items.reduce(
              (sum, item) => sum + item.total_price,
              0
            )

            return (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.customer_id}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">
                  <ul>
                    {order.order_items.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        <div>
                          <strong>Product:</strong> {item.product.name || item.product.id}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {item.quantity}
                        </div>
                        <div>
                          <strong>Unit Price:</strong> {item.unit_price}
                        </div>
                        <div>
                          <strong>Total:</strong> {item.total_price}
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border font-semibold">{totalPrice}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
