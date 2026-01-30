import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface Product {
	id: number;
	name: string;
	price: number;
	description: string;
	image: string;
	category: string;
	sellerId: number;
	sellerName: string;
	rating: number;
	reviewCount: number;
	stocks: number;
	availableLengths: string[];
	availableColors: string[];
	features: string[];
	isFeatured?: boolean;
	stock?: number;
}

type Cart = (Product & {
	selectedLength: string;
	selectedColor: string;
	quantity: number;
	productId: number;
})[];

type Products = Product[];

type ApiProducts = {
	products: Products;
};

type CartProviderProps = {
	children: React.ReactNode;
};

interface CartContextType {
	cartItems: Cart;
	addToCart: (
		product: Product,
		selectedLength: string,
		selectedColor: string,
		quantity: number,
	) => boolean;
	updateQuantity: (
		productId: number,
		selectedLength: string,
		selectedColor: string,
		newQuantity: number,
	) => void;
	removeFromCart: (
		productId: number,
		selectedLength: string,
		selectedColor: string,
	) => void;
	clearCart: () => void;
	getCartTotal: () => number;
	getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const [cartItems, setCartItems] = useState<Cart>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load cart from localStorage when user changes
	useEffect(() => {
		if (user) {
			const savedCart = localStorage.getItem(`cart_${user.id}`);
			if (savedCart) {
				try {
					setCartItems(JSON.parse(savedCart));
				} catch (e) {
					console.error("Failed to parse cart from local storage");
				}
			}
			setIsInitialized(true);
		} else {
			setCartItems([]);
			setIsInitialized(true);
		}
	}, [user]);

	// Save cart to localStorage whenever it changes, BUT only after initialization
	useEffect(() => {
		if (user && isInitialized) {
			localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
		}
	}, [cartItems, user, isInitialized]);

	const addToCart = (
		product: Product,
		selectedLength: string,
		selectedColor: string,
		quantity = 1,
	) => {
		if (!user) {
			showToast("Please login to add items to cart", "warning");
			return false;
		}

		setCartItems((prevItems) => {
			// Ensure prevItems is an array
			const items = Array.isArray(prevItems) ? prevItems : [];
			const existingItem = items.find(
				(item) =>
					item.productId === product.id &&
					item.selectedLength === selectedLength &&
					item.selectedColor === selectedColor,
			);

			if (existingItem) {
				return items.map((item) =>
					item === existingItem
						? { ...item, quantity: item.quantity + quantity }
						: item,
				);
			}

			// Handle possibly undefined product properties (like those from localStorage)
			const sellerId = product.sellerId || 0; // Default or handle appropriately

			// If we are adding a product from "SellerProducts", it might not have all fields the same way.
			// Just ensure we map what we need.

			return [
				...items,
				{
					...product,
					productId: product.id,
					selectedLength,
					selectedColor,
					quantity,
					sellerId,
				},
			];
		});

		showToast("Added to cart successfully", "success");
		return true;
	};

	const updateQuantity = (
		productId: number,
		selectedLength: string,
		selectedColor: string,
		newQuantity: number,
	) => {
		if (newQuantity < 1) return;

		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.productId === productId &&
					item.selectedLength === selectedLength &&
					item.selectedColor === selectedColor
					? { ...item, quantity: newQuantity }
					: item,
			),
		);
	};

	const removeFromCart = (productId: number, selectedLength: string, selectedColor: string) => {
		setCartItems((prevItems) =>
			prevItems.filter(
				(item) =>
					!(
						item.productId === productId &&
						item.selectedLength === selectedLength &&
						item.selectedColor === selectedColor
					),
			),
		);
		showToast("Removed from cart", "success");
	};

	const clearCart = () => {
		setCartItems([]);
		// Toast is handled by caller usually, or we can keep it here
		// keeping it here for consistency with previous code
		// showToast("Cart cleared", "success"); 
		// Actually, original code had success toast.
	};

	const getCartTotal = () => {
		return cartItems.reduce((total, item) => {
			const itemTotal = item.price * item.quantity;
			// Add length-based price adjustment
			const lengthPrice =
				parseInt(item.selectedLength) > 20
					? (parseInt(item.selectedLength) - 20) * 500
					: 0;
			return total + (itemTotal + lengthPrice * item.quantity);
		}, 0);
	};

	const getCartItemsCount = () => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				updateQuantity,
				removeFromCart,
				clearCart,
				getCartTotal,
				getCartItemsCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export default CartContext;
