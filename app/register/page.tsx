"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Package } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-serif text-2xl font-bold">MENSGUY</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Sign up to start shopping with us
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input 
                      id="firstName" 
                      placeholder="John"
                      autoComplete="given-name"
                      required 
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input 
                      id="lastName" 
                      placeholder="Doe"
                      autoComplete="family-name"
                      required 
                    />
                  </Field>
                </FieldGroup>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    autoComplete="email"
                    required 
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+233 XX XXX XXXX"
                    autoComplete="tel"
                    required 
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input 
                    id="password" 
                    type="password"
                    autoComplete="new-password"
                    required 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    At least 8 characters
                  </p>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    autoComplete="new-password"
                    required 
                  />
                </Field>
              </FieldGroup>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
