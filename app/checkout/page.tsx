"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  ChevronLeft,
  Truck,
  MapPin,
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Calendar,
  Loader2
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const requestId = searchParams.get("request")
  const isInstallment = searchParams.get("installment") === "true"
  const { items: cartHookItems, clearCart } = useCart()

  const [deliveryMethod, setDeliveryMethod] = React.useState("delivery")
  const [paymentMethod, setPaymentMethod] = React.useState("momo")
  const [requestInstallment, setRequestInstallment] = React.useState(isInstallment)
  const [cartItems, setCartItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(!!requestId)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Customer details form state
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    landmark: ""
  })

  React.useEffect(() => {
    if (requestId) {
      async function loadRequest() {
        try {
          const res = await fetchApi(`/requests.php?id=${requestId}`)
          if (res.status === 'success' && res.data) {
            setCartItems([{
              id: res.data.id,
              name: res.data.product_name,
              price: parseFloat(res.data.budget || 0),
              quantity: 1
            }])
          }
        } catch (error) {
          console.error("Failed to load request for checkout", error)
        } finally {
          setLoading(false)
        }
      }
      loadRequest()
    } else {
      setCartItems(cartHookItems)
      setLoading(false)
    }
  }, [requestId, cartHookItems])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = deliveryMethod === "pickup" ? 0 : 20.00
  const total = subtotal + delivery

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      toast.error("Your shopping cart is empty.")
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required contact details.")
      return
    }

    if (deliveryMethod === "delivery" && (!formData.address || !formData.city)) {
      toast.error("Please provide your delivery street address and city.")
      return
    }

    setIsSubmitting(true)
    try {
      const orderPayload = {
        type: requestInstallment ? 'Installment' : 'In-Stock',
        total_amount: total,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        customer_info: formData,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod
      }

      const res = await fetchApi('/orders.php', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      })

      if (res.status === 'success') {
        toast.success(`Order placed successfully! Order #${res.order_number}`)
        clearCart()
        router.push('/dashboard/orders')
      } else {
        toast.error(res.message || "Failed to place order.")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while submitting your order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="bg-secondary/30 py-8 lg:py-12">
              <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/cart">
                      <ChevronLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl">
                      Checkout
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                      Complete your order
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
              <form onSubmit={handlePlaceOrder}>
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Checkout Form */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Method */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          Delivery Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={deliveryMethod}
                          onValueChange={setDeliveryMethod}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          <Label
                            htmlFor="delivery"
                            className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            <RadioGroupItem value="delivery" id="delivery" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Delivery</span>
                                <span className="text-sm font-medium">GH¢ 20.00</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Delivered to your address
                              </p>
                            </div>
                          </Label>
                          <Label
                            htmlFor="pickup"
                            className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            <RadioGroupItem value="pickup" id="pickup" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Pickup</span>
                                <span className="text-sm font-medium text-success">Free</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Collect from our warehouse
                              </p>
                            </div>
                          </Label>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    {/* Customer Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {deliveryMethod === "delivery" ? "Delivery Details" : "Contact Details"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                              <Input
                                id="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                required
                              />
                            </Field>
                          </FieldGroup>
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                              <Input
                                id="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                required
                              />
                            </Field>
                          </FieldGroup>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="email">Email *</FieldLabel>
                              <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                              />
                            </Field>
                          </FieldGroup>
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+233 XX XXX XXXX"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                              />
                            </Field>
                          </FieldGroup>
                        </div>

                        {deliveryMethod === "delivery" && (
                          <>
                            <FieldGroup>
                              <Field>
                                <FieldLabel htmlFor="address">Street Address *</FieldLabel>
                                <Input
                                  id="address"
                                  placeholder="123 Main Street"
                                  value={formData.address}
                                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                                  required
                                />
                              </Field>
                            </FieldGroup>

                            <div className="grid gap-4 sm:grid-cols-3">
                              <FieldGroup>
                                <Field>
                                  <FieldLabel htmlFor="city">City *</FieldLabel>
                                  <Input
                                    id="city"
                                    placeholder="Accra"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    required
                                  />
                                </Field>
                              </FieldGroup>
                              <FieldGroup>
                                <Field>
                                  <FieldLabel htmlFor="region">Region</FieldLabel>
                                  <Input
                                    id="region"
                                    placeholder="Greater Accra"
                                    value={formData.region}
                                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                                  />
                                </Field>
                              </FieldGroup>
                              <FieldGroup>
                                <Field>
                                  <FieldLabel htmlFor="landmark">Landmark</FieldLabel>
                                  <Input
                                    id="landmark"
                                    placeholder="Near..."
                                    value={formData.landmark}
                                    onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                                  />
                                </Field>
                              </FieldGroup>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-primary" />
                          Payment Method
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className="space-y-3"
                        >
                          <Label
                            htmlFor="momo"
                            className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "momo" ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            <RadioGroupItem value="momo" id="momo" />
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Mobile Money</span>
                              <p className="text-sm text-muted-foreground">
                                MTN, Vodafone, AirtelTigo
                              </p>
                            </div>
                          </Label>
                          <Label
                            htmlFor="bank"
                            className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            <RadioGroupItem value="bank" id="bank" />
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Bank Transfer</span>
                              <p className="text-sm text-muted-foreground">
                                Direct bank deposit
                              </p>
                            </div>
                          </Label>
                          <Label
                            htmlFor="cash"
                            className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "cash" ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            <RadioGroupItem value="cash" id="cash" />
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <span className="font-medium">Cash on Delivery/Pickup</span>
                              <p className="text-sm text-muted-foreground">
                                Pay when you receive
                              </p>
                            </div>
                          </Label>
                        </RadioGroup>

                        <Separator />

                        {/* Installment Option */}
                        <div className="flex items-start space-x-3 rounded-lg border p-4 bg-accent/5">
                          <Checkbox
                            id="installment"
                            checked={requestInstallment}
                            onCheckedChange={(checked) => setRequestInstallment(checked as boolean)}
                          />
                          <div className="flex-1">
                            <Label htmlFor="installment" className="font-medium cursor-pointer flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Request Installment Payment
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Pay in installments over 2-6 months. Our team will contact you to set up a payment plan.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Items */}
                        <div className="space-y-3">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-medium shrink-0">
                                GH¢ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        {/* Price Breakdown */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>GH¢ {subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Delivery</span>
                            <span>{delivery === 0 ? "Free" : `GH¢ ${delivery.toFixed(2)}`}</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>GH¢ {total.toFixed(2)}</span>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            requestInstallment ? "Submit Order Request" : "Place Order"
                          )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Secure checkout</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
