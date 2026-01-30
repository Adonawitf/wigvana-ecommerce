import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import client from "../api/client";

type AuthProviderProps = {
	children: React.ReactNode;
};

interface User {
	_id: string; // Backend uses UUID strings
	email: string;
	name: string;
	firstName?: string;
	lastName?: string;
	isSeller: boolean;
	token: string;
	roles: string[];
	isAdmin: boolean;
	isSellerProfileComplete?: boolean;
	storeName?: string;
	storeId?: string;
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
	login: (email: string, password: string) => Promise<User | null>;
	register: (userData: RegisterData) => Promise<User | null>;
	logout: () => void;
	becomeSeller: (formData: FormData) => Promise<boolean>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check for stored user data on component mount
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			// Calculate isAdmin on load
			parsedUser.isAdmin = parsedUser.roles?.includes('admin') || false;
			setUser(parsedUser);
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const { data } = await client.post("/auth/login", { email, password });

			const userData = {
				...data.user,
				token: data.accessToken,
				isSeller: data.user.roles?.includes('seller') || false,
				isAdmin: data.user.roles?.includes('admin') || false,
			};

			setUser(userData as User);
			localStorage.setItem("user", JSON.stringify(userData));
			toast.success("Successfully logged in!");
			return userData as User;
		} catch (error: any) {
			const message = error.response?.data?.message || "Login failed. Please check your credentials.";
			toast.error(message);
			return null;
		}
	};

	const register = async (userData: RegisterData) => {
		try {
			const payload = {
				firstName: userData.firstName || userData.email.split('@')[0],
				lastName: userData.lastName || '',
				email: userData.email,
				password: userData.password,
				roles: userData.isSeller ? ['buyer', 'seller'] : ['buyer'],
			};

			const { data } = await client.post("/auth/register", payload);

			const newUserData = {
				...data.user,
				token: data.accessToken,
				isSeller: data.user.roles?.includes('seller') || false,
				isAdmin: data.user.roles?.includes('admin') || false,
			};

			setUser(newUserData as User);
			localStorage.setItem("user", JSON.stringify(newUserData));
			toast.success("Successfully registered!");
			return newUserData as User;
		} catch (error: any) {
			console.error("Registration error:", error);
			const message = error.response?.data?.message || "Registration failed. Please try again.";
			toast.error(message);
			return null;
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
			toast.success("Seller account activated!");
			await refreshUser();
			return true;
		} catch (error: any) {
			console.error("Seller application error", error);
			const msg = error.response?.data?.message || "Failed to activate seller account";
			toast.error(msg);
			return false;
		}
	};

	const refreshUser = async () => {
		try {
			const { data } = await client.get('/auth/me');
			const updatedUserData = {
				...user,
				...data,
				isSeller: data.roles?.includes('seller') || false,
				isAdmin: data.roles?.includes('admin') || false,
			};
			setUser(updatedUserData as User);
			localStorage.setItem("user", JSON.stringify(updatedUserData));
		} catch (error) {
			console.error("Error refreshing user:", error);
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
		refreshUser,
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
