import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MessagingProvider } from "./context/MessagingContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ProductProvider } from "./context/ProductContext";
import { ToastProvider } from "./context/ToastContext";
import Footer from "./components/Footer";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ToastContainer position="top-right" autoClose={3000} />
				<ToastProvider>
					<AuthProvider>
						<ProductProvider>
							<CartProvider>
								<FavoritesProvider>
									<MessagingProvider>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												minHeight: "100vh",
												backgroundColor: "#FFFFFF",
											}}
										>
											<Navbar />
											<main style={{ flex: 1 }}>
												<AppRoutes />
											</main>
											<Footer />
										</div>
									</MessagingProvider>
								</FavoritesProvider>
							</CartProvider>
						</ProductProvider>
					</AuthProvider>
				</ToastProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default App;
