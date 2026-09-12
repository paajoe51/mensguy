"use client"

import { useState } from "react"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Search,
  FileText,
  MessageSquare,
  Package,
  Upload,
  Info,
  Loader2,
  CheckCircle2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useCategories } from "@/lib/useCategories"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const steps = [
  {
    icon: Search,
    title: "1. Submit Request",
    description: "Fill out the form with details about the product you want. Include a link if you have one.",
  },
  {
    icon: FileText,
    title: "2. Get a Quote",
    description: "We'll review your request and provide a detailed quote within 24-48 hours.",
  },
  {
    icon: MessageSquare,
    title: "3. Confirm & Pay",
    description: "Approve the quote and make payment. Choose full payment or installment plan.",
  },
  {
    icon: Package,
    title: "4. Receive Item",
    description: "We handle procurement, shipping, and delivery. Track progress in your dashboard.",
  },
]

export default function RequestPage() {
  const { categories } = useCategories()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    product_name: "",
    category_id: "",
    link: "",
    quantity: "1",
    budget: "",
    description: "",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetchApi("/requests.php", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          quantity: parseInt(form.quantity) || 1,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          budget: form.budget ? parseFloat(form.budget) : null
        })
      })
      toast.success("Request submitted successfully!")
      setSubmitted(true)
      setTimeout(() => router.push("/dashboard/requests"), 3000)
    } catch (e: any) {
      toast.error(e.message || "Failed to submit request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 pt-20">
          <Card className="max-w-md w-full text-center p-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-2xl mb-2">Request Received!</CardTitle>
            <CardDescription className="text-base mb-6">
              Your sourcing request for <strong>{form.product_name}</strong> has been submitted.
              We'll review it and get back to you with a quote soon.
            </CardDescription>
            <Button className="w-full" onClick={() => router.push("/dashboard/requests")}>
              Go to My Requests
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* Page Header */}
        <div className="bg-secondary/30 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
              Request an Item
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Can't find what you're looking for? Request any product from overseas and
              we'll source it for you.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          {/* How It Works */}
          <div className="mb-12">
            <h2 className="font-semibold text-lg mb-6">How the Request Process Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Item Request Form</CardTitle>
                  <CardDescription>
                    Provide as much detail as possible to help us find exactly what you need.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="product_name">Item Name *</FieldLabel>
                          <Input
                            id="product_name"
                            placeholder="e.g., iPhone 15 Pro Max 256GB"
                            value={form.product_name}
                            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                            required
                          />
                        </Field>
                      </FieldGroup>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <Select
                            value={form.category_id}
                            onValueChange={(v) => setForm({ ...form, category_id: v })}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                    </div>

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="product-link">Product Link</FieldLabel>
                        <Input
                          id="product-link"
                          type="url"
                          placeholder="https://www.amazon.com/..."
                          value={form.link}
                          onChange={(e) => setForm({ ...form, link: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-foreground/70">
                          Paste a link to the exact product from Amazon, eBay, AliExpress, etc.
                        </p>
                      </Field>
                    </FieldGroup>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            required
                          />
                        </Field>
                      </FieldGroup>

                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="budget">Estimated Budget (GH¢)</FieldLabel>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="e.g., 5000"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          />
                        </Field>
                      </FieldGroup>
                    </div>

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="description">Description *</FieldLabel>
                        <Textarea
                          id="description"
                          placeholder="Describe the item in detail - color, size, specifications, any preferences..."
                          rows={4}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          required
                        />
                      </Field>
                    </FieldGroup>

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
                        <Textarea
                          id="notes"
                          placeholder="Any other information we should know..."
                          rows={3}
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                      </Field>
                    </FieldGroup>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-sky-50 border border-sky-100">
                      <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-sky-900">What happens next?</p>
                        <p className="text-sky-700 mt-1">
                          After you submit your request, our team will review it and send you a
                          detailed quote within 24-48 hours. The quote will include the product
                          cost, shipping fees, and estimated delivery time.
                        </p>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6 text-foreground">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Quote Validity</h4>
                    <p className="text-muted-foreground">
                      Quotes are valid for 7 days from the date issued.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Payment Options</h4>
                    <p className="text-muted-foreground">
                      Pay in full or request an installment plan for orders above GH¢500.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Shipping Times</h4>
                    <p className="text-muted-foreground">
                      US/UK: 2-4 weeks | China: 3-6 weeks | Other: varies
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Cancellation</h4>
                    <p className="text-muted-foreground">
                      Orders can be cancelled before procurement begins. Once shipped,
                      orders are non-refundable.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground mb-4 font-medium italic opacity-80">
                    Not sure about your request? Contact us for assistance.
                  </p>
                  <div className="space-y-2">
                    <p>
                      <span className="text-muted-foreground font-bold">Email:</span>{" "}
                      info@mensguyimport.com
                    </p>
                    <p>
                      <span className="text-muted-foreground font-bold">Phone:</span>{" "}
                      +233 XX XXX XXXX
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
