"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        
        // TODO: Replace with actual API call when backend is ready
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUser: User = {
            id: 1,
            name: email.split("@")[0],
            email: email,
            role: "Admin",
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
