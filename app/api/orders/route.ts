import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "@/lib/services/orders"
import { PaymentService } from "@/lib/services/payments"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Create order
    const order = await OrderService.createOrder(orderData)

    // Create payment record
    const payment = await PaymentService.createPayment({
      orderId: order.id,
      method: orderData.paymentMethod,
      amount: order.total_amount,
      bankName: orderData.bankDetails?.bankName,
      accountNumber: orderData.bankDetails?.accountNumber,
      transferReference: orderData.bankDetails?.transferReference,
    })

    return NextResponse.json(
      {
        order,
        payment,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      status: searchParams.get("status") || undefined,
      customerId: searchParams.get("customerId") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined,
    }

    const orders = await OrderService.getOrders(filters)

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
