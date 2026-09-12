"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from './api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    customer_id?: number | null;
    permissions?: Record<string, string>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // On mount, check if session is active
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            setLoading(true);
            const res = await fetchApi('/access_control/session.php', { method: 'GET' });
            if (res.authenticated && res.user) {
                setUser(res.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any) => {
        const res = await fetchApi('/access_control/login.php', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        setUser(res.user);

        // Redirect based on role
        if (res.user.role === 'Customer') {
            router.push('/dashboard/orders');
        } else {
            router.push('/admin');
        }
    };

    const logout = async () => {
        await fetchApi('/access_control/logout.php', { method: 'POST' });
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
