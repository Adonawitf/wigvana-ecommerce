import type React from "react";
import { createContext, useContext, useState, useEffect, use } from "react";
import AuthContext from "./AuthContext";
import client from "../api/client";

type ProductProviderProps = {
	children: React.ReactNode;
};

interface Product {
	_id: string;
	id?: string; // Support for legacy access
	name: string;
	basePrice: number;
	price?: number; // Support for legacy access
	description: string;
	images: Array<{ imageUrl: string; isCover: boolean }>;
	image?: string; // Support for legacy access
	categoryId: any; // Populated or ID
	category?: string; // Mapping for legacy
	sellerId: any; // Populated or ID
	sellerName?: string;
	rating?: number;
	averageRating?: number;
	reviewCount: number;
	stockQuantity?: number;
	stock?: number;
	availableLengths?: string[];
	availableColors?: string[];
	features?: string[];
	isFeatured?: boolean;
}

type Products = Product[];

interface ProductContextType {
	products: Products;
	loading: boolean;
	fetchProducts: () => Promise<void>;
	addProduct: (product: any) => Promise<Product>;
	updateProduct: (productId: string, product: any) => Promise<void>;
	deleteProduct: (productId: string) => Promise<void>;
	getSellerProducts: () => Products;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
	const context = useContext(ProductContext);
	if (!context) {
		throw new Error("useProducts must be used within a ProductProvider");
	}
	return context;
};

export const ProductProvider: React.FC<ProductProviderProps> = ({
	children,
}) => {
	const authContext = use(AuthContext);
	const { user } = authContext || {};

	const [products, setProducts] = useState<Products>([]);
	const [loading, setLoading] = useState(false);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const { data: publicData } = await client.get("/products?limit=100");
			const publicResults = publicData.results || [];

			let allResults = [...publicResults];

			// If logged in as seller, also fetch owned products (even pending/private)
			const sellerId = user?._id || user?.id;
			if (user?.isSeller && sellerId) {
				console.log("Fetching seller products for sellerId:", sellerId);
				try {
					const { data: sellerData } = await client.get("/me/products?limit=100");
					const sellerResults = (sellerData.results || []).map((p: any) => ({
						...p,
						// Ensure sellerId is set even if implicit in backend response
						sellerId: p.sellerId || sellerId
					}));
					console.log("Fetched seller products:", sellerResults.length);

					// Merge and avoid duplicates by ID
					sellerResults.forEach((sp: any) => {
						const existingIdx = allResults.findIndex(p => (p._id || p.id) === (sp._id || sp.id));
						if (existingIdx !== -1) {
							// Update existing with more complete data from /me/products
							allResults[existingIdx] = { ...allResults[existingIdx], ...sp };
						} else {
							allResults.push(sp);
						}
					});
				} catch (err) {
					console.error("Error fetching seller products:", err);
				}
			}

			// Map backend props to legacy props for compatibility
			const mapped = allResults.map((p: any) => ({
				...p,
				id: p._id,
				price: p.basePrice,
				image: p.images?.[0]?.imageUrl || "https://via.placeholder.com/200",
				category: (typeof p.categoryId === 'object' ? p.categoryId.name : '') || "Uncategorized",
				rating: p.averageRating || 0,
				stock: p.stockQuantity || 0
			}));

			setProducts(mapped);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [user?._id, user?.isSeller]);

	const addProduct = async (productData: any) => {
		const { data } = await client.post("/me/products", productData);
		await fetchProducts(); // Refresh
		return data;
	};

	const updateProduct = async (productId: string, updatedData: any) => {
		await client.put(`/me/products/${productId}`, updatedData);
		await fetchProducts();
	};

	const deleteProduct = async (productId: string) => {
		await client.delete(`/me/products/${productId}`);
		await fetchProducts();
	};

	const getSellerProducts = () => {
		// Filter by seller ID if available
		const sellerId = user?._id || user?.id;
		if (!sellerId) return [];
		return products.filter((product) => {
			const prodSellerId = typeof product.sellerId === 'object'
				? (product.sellerId._id || product.sellerId.id)
				: product.sellerId;
			return prodSellerId === sellerId;
		});
	};

	return (
		<ProductContext.Provider
			value={{
				products,
				loading,
				fetchProducts,
				addProduct,
				updateProduct,
				deleteProduct,
				getSellerProducts,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};

export default ProductContext;
