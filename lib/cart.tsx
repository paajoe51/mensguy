"use client"

import * as React from "react"

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  totalCount: number
  subtotal: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("mensguy_cart")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage on change
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mensguy_cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id)
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
