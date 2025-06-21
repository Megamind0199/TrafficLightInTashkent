import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
    id: string;
    email: string;
    role: "admin" | "user";
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, callback?: () => void) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
            } catch {
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (token: string, callback?: () => void) => {
        localStorage.setItem("token", token);
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
        if (callback) callback(); // ✅ navigate() ni bu yerga o'tkazamiz
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
