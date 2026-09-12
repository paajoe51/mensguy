// lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_PHP_API_URL || 'https://mensguy.kmcompanies.net/api';

/**
 * Standard fetchWrapper for API calls that automatically includes credentials (cookies)
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // vital for PHP session cookies
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'An error occurred during the request.');
    }

    return data;
}
