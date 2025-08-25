"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Shield, CheckCircle, Copy, Phone, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentClient() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const orderTotal = 255000 // Sample total
  const orderNumber = "OLK-" + Date.now().toString().slice(-6)

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "Olukosi Carpets Ltd",
    accountNumber: "3012345678",
    sortCode: "011151003",
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setPaymentComplete(true)
    setIsProcessing(false)

    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push("/order-success")
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order #{orderNumber} has been confirmed.</p>
            <p className="text-sm text-gray-500">Redirecting to order confirmation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Complete Payment</h1>
            <p className="text-lg text-gray-600">Secure payment for Order #{orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="card">Debit/Credit Card</SelectItem>
                      <SelectItem value="ussd">USSD Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Bank Transfer */}
              {paymentMethod === "bank-transfer" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bank Transfer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Transfer the exact amount to the account below and send proof of payment.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm text-gray-600">Bank Name</Label>
                          <p className="font-medium">{bankDetails.bankName}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm text-gray-600">Account Name</Label>
                          <p className="font-medium">{bankDetails.accountName}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm text-gray-600">Account Number</Label>
                          <p className="font-medium">{bankDetails.accountNumber}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(bankDetails.accountNumber)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label className="text-sm text-gray-600">Amount</Label>
                          <p className="font-medium text-lg">₦{orderTotal.toLocaleString()}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(orderTotal.toString())}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Send Proof of Payment:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">WhatsApp: +234 812 487 2665</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Email: olukosicarpets@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Card Payment */}
              {paymentMethod === "card" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Card Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardData.cardName}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cardName: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* USSD Payment */}
              {paymentMethod === "ussd" && (
                <Card>
                  <CardHeader>
                    <CardTitle>USSD Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>Dial the USSD code below from your registered phone number.</AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <Label className="text-sm text-gray-600">GTBank</Label>
                        <p className="text-2xl font-mono font-bold">*737*1*{orderTotal}#</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <Label className="text-sm text-gray-600">First Bank</Label>
                        <p className="text-2xl font-mono font-bold">*894*1*{orderTotal}#</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <Label className="text-sm text-gray-600">Access Bank</Label>
                        <p className="text-2xl font-mono font-bold">*901*1*{orderTotal}#</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-medium">Luxury Persian Carpet</h4>
                        <p className="text-sm text-gray-600">Qty: 1</p>
                      </div>
                      <span className="font-semibold">₦120,000</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-medium">Modern Geometric Rug</h4>
                        <p className="text-sm text-gray-600">Qty: 2</p>
                      </div>
                      <span className="font-semibold">₦130,000</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₦250,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>₦5,000</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>₦{orderTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-600">Secure Payment</span>
                    </div>

                    <Button
                      onClick={handlePayment}
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing Payment..." : `Pay ₦${orderTotal.toLocaleString()}`}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    By completing this payment, you agree to our Terms of Service and Privacy Policy.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
