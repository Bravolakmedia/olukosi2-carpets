import { type NextRequest, NextResponse } from "next/server"
import { PaymentService } from "@/lib/services/payments"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, notes, adminId } = await request.json()

    const payment = await PaymentService.updatePaymentStatus(params.id, status, adminId, notes)

    return NextResponse.json({
      payment,
      message: "Payment status updated successfully",
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}
