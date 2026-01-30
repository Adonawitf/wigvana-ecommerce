import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import client from "../api/client";

type AuthProviderProps = {
	children: React.ReactNode;
};

interface User {
	id: number;
	email: string;
	name: string;
	firstName?: string;
	lastName?: string;
	isSeller: boolean;
	token: string;
	role?: string;
	isSellerProfileComplete?: boolean;
	storeName?: string;
	storeId?: number;
}

interface RegisterData {
	email: string;
	password: string;
	type: string;
	isSeller: boolean;
	firstName?: string;
	lastName?: string;
}

interface FormData {
	storeName: string;
	description: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (userData: RegisterData) => Promise<boolean>;
	logout: () => void;
	becomeSeller: (formData: FormData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for stored user data on component mount
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser) as User);
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const { data } = await client.post("/auth/login", { email, password });

			const userData = {
				...data.user,
				token: data.accessToken,
				isSeller: data.user.role === 'seller',
			};

			setUser(userData);
			localStorage.setItem("user", JSON.stringify(userData));
			toast.success("Successfully logged in!");
			return true;
		} catch (error: any) {
			const message = error.response?.data?.message || "Login failed. Please check your credentials.";
			toast.error(message);
			return false;
		}
	};

	const register = async (userData: RegisterData) => {
		try {
			const payload = {
				firstName: userData.firstName || userData.email.split('@')[0],
				lastName: userData.lastName || '',
				email: userData.email,
				password: userData.password,
			};

			const { data } = await client.post("/auth/register", payload);

			const newUserData = {
				...data.user,
				token: data.accessToken,
				isSeller: data.user.role === 'seller',
			};

			setUser(newUserData);
			localStorage.setItem("user", JSON.stringify(newUserData));
			toast.success("Successfully registered!");
			return true;
		} catch (error: any) {
			console.error("Registration error:", error);
			const message = error.response?.data?.message || "Registration failed. Please try again.";
			toast.error(message);
			return false;
		}
	};

	const logout = async () => {
		try {
			await client.post("/auth/logout");
		} catch (error) {
			console.error("Logout error", error);
		}
		setUser(null);
		localStorage.removeItem("user");
		toast.success("Successfully logged out!");
	};

	const becomeSeller = async (formData: FormData) => {
		try {
			await client.post('/me/seller-application', { storeName: formData.storeName, description: formData.description });
			toast.success("Seller application submitted!");
			// Note: In a real app, we might need to refresh user profile to see if role changed (if auto-approved)
			// or wait for admin. For now, we trust the backend handles the application.
			return true;
		} catch (error: any) {
			console.error("Seller application error", error);
			const msg = error.response?.data?.message || "Failed to submit application";
			toast.error(msg);
			return false;
		}
	};
	const contextValue: AuthContextType = {
		user,
		loading,
		isAuthenticated: !!user,
		login,
		register,
		logout,
		becomeSeller,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthContext;
