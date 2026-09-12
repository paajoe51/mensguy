"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@mensguyimport.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 XX XXX XXXX",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Accra, Ghana",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sat: 9AM - 6PM",
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Contact Us
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                Get in Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Have questions about our products or services? Want to make a 
                special request? We're here to help. Reach out to us through any 
                of the channels below.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((item, index) => (
                <Card key={index}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Full Name</FieldLabel>
                      <Input id="name" placeholder="John Doe" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </Field>
                  </FieldGroup>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input id="phone" type="tel" placeholder="+233 XX XXX XXXX" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <Input id="subject" placeholder="How can we help?" />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={4}
                    />
                  </Field>
                </FieldGroup>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
