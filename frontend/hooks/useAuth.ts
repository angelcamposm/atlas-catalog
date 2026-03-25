/**
 * useAuth hook
 *
 * Provides authentication state and actions:
 * - user, isAuthenticated, loading
 * - login(data), logout()
 *
 * Must be used inside <AuthProvider>.
 */

export { useAuthContext as useAuth } from "@/lib/auth-context";
