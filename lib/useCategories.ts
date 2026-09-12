// lib/useCategories.ts
// Shared hook to fetch categories from the backend.
// Used in: Admin categories page, Admin products form, Customer shop pages.

import { useState, useEffect } from "react"
import { fetchApi } from "./api"

export interface Category {
    id: number
    name: string
    description?: string
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetchApi("/products.php?resource=categories")
            setCategories(res.data || [])
        } catch (e: any) {
            setError(e.message || "Failed to load categories")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return { categories, loading, error, reload: load }
}
