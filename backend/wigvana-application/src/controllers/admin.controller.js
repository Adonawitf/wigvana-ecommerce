import httpStatusCodes from "http-status-codes";
import { userService } from "../services/user.service.js";
import { sellerService } from "../services/seller.service.js";
import { productService } from "../services/product.service.js";
import { categoryService } from "../services/category.service.js";
import { orderService } from "../services/order.service.js";
import { reviewService } from "../services/review.service.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import catchAsync from "../utils/catchAsync.js";
import pick from "../utils/pick.js";

// --- User Management ---
const listUsers = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, [
    "page",
    "limit",
    "role",
    "status",
    "search",
  ]);
  const result = await userService.listAllUsers(queryOptions);
  res.status(httpStatusCodes.OK).send(result);
});

const getUserDetails = catchAsync(async (req, res) => {
  const user = await userService.adminGetUserById(req.params.userId);
  res.status(httpStatusCodes.OK).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.adminUpdateUser(req.params.userId, req.body);
  res.status(httpStatusCodes.OK).send(user);
});

const suspendUser = catchAsync(async (req, res) => {
  const user = await userService.suspendUser(req.params.userId);
  res.status(httpStatusCodes.OK).send(user);
});

const unsuspendUser = catchAsync(async (req, res) => {
  const user = await userService.unsuspendUser(req.params.userId);
  res.status(httpStatusCodes.OK).send(user);
});

// --- Seller Application Management ---
const listSellerApplications = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ["page", "limit", "status", "userId"]);
  const result = await sellerService.listAllSellerApplications(queryOptions);
  res.status(httpStatusCodes.OK).send(result);
});

const approveSellerApplication = catchAsync(async (req, res) => {
  const application = await sellerService.approveSellerApplication(
    req.user.id,
    req.params.applicationId,
  );
  res.status(httpStatusCodes.OK).send(application);
});

const rejectSellerApplication = catchAsync(async (req, res) => {
  const application = await sellerService.rejectSellerApplication(
    req.user.id,
    req.params.applicationId,
    req.body.reason,
  );
  res.status(httpStatusCodes.OK).send(application);
});

// --- Product Management ---
const listAllProducts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, [
    "page",
    "limit",
    "sellerId",
    "categoryId",
    "status",
    "isPublished",
    "search",
    "sort_by",
    "order",
  ]);
  const result = await productService.listAllPlatformProducts(queryOptions);
  res.status(httpStatusCodes.OK).send(result);
});

const getAnyProductDetails = catchAsync(async (req, res) => {
  const product = await productService.adminGetProductById(
    req.params.productId,
  );
  res.status(httpStatusCodes.OK).send(product);
});

const updateAnyProduct = catchAsync(async (req, res) => {
  const product = await productService.adminUpdateProduct(
    req.params.productId,
    req.body,
  );
  res.status(httpStatusCodes.OK).send(product);
});

const deleteAnyProduct = catchAsync(async (req, res) => {
  await productService.adminDeleteProduct(req.params.productId);
  res.status(httpStatusCodes.NO_CONTENT).send();
});

const featureProduct = catchAsync(async (req, res) => {
  const product = await productService.featureProduct(req.params.productId);
  res.status(httpStatusCodes.OK).send(product);
});

const unfeatureProduct = catchAsync(async (req, res) => {
  const product = await productService.unfeatureProduct(req.params.productId);
  res.status(httpStatusCodes.OK).send(product);
});

// --- Category Management ---
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.adminCreateCategory(req.body);
  res.status(httpStatusCodes.CREATED).send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.adminUpdateCategory(
    req.params.categoryId,
    req.body,
  );
  res.status(httpStatusCodes.OK).send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.adminDeleteCategory(req.params.categoryId);
  res.status(httpStatusCodes.NO_CONTENT).send();
});

// --- Order Management ---
const listAllOrders = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, [
    "page",
    "limit",
    "userId",
    "sellerId",
    "status",
    "orderId",
  ]);
  const result = await orderService.listAllPlatformOrders(queryOptions);
  res.status(httpStatusCodes.OK).send(result);
});

const getAnyOrderDetails = catchAsync(async (req, res) => {
  const order = await orderService.adminGetOrderById(req.params.orderId);
  res.status(httpStatusCodes.OK).send(order);
});

const updateAnyOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.adminUpdateOrderStatus(
    req.params.orderId,
    req.body,
  );
  res.status(httpStatusCodes.OK).send(order);
});

const processOrderRefund = catchAsync(async (req, res) => {
  const order = await orderService.adminProcessRefund(
    req.params.orderId,
    req.body,
  );
  res.status(httpStatusCodes.OK).send(order);
});

// --- Review Management ---
const listAllReviews = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, [
    "page",
    "limit",
    "userId",
    "productId",
    "isApproved",
    "rating",
  ]);
  const result = await reviewService.listAllPlatformReviews(queryOptions);
  res.status(httpStatusCodes.OK).send(result);
});

const deleteAnyReview = catchAsync(async (req, res) => {
  await reviewService.adminDeleteReview(req.params.reviewId);
  res.status(httpStatusCodes.NO_CONTENT).send();
});

const updateReviewStatus = catchAsync(async (req, res) => {
  const review = await reviewService.adminUpdateReviewStatus(
    req.params.reviewId,
    req.body,
  );
  res.status(httpStatusCodes.OK).send(review);
});

const getStats = catchAsync(async (req, res) => {
  const [userCount, productCount, orderCount, revenueData, recentUsers, pendingProducts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).select("-passwordHash"),
    Product.find({ approvalStatus: "pending" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sellerId", "firstName lastName"),
  ]);

  console.log('Admin Stats Debug:', { userCount, productCount, orderCount, revenueDataLength: revenueData.length });

  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  res.status(httpStatusCodes.OK).send({
    users: userCount,
    products: productCount,
    orders: orderCount,
    revenue: totalRevenue,
    recentUsers,
    pendingProducts,
  });
});

export const adminController = {
  // Users
  listUsers,
  getUserDetails,
  updateUser,
  suspendUser,
  unsuspendUser,
  // Seller Applications
  listSellerApplications,
  approveSellerApplication,
  rejectSellerApplication,
  // Products
  listAllProducts,
  getAnyProductDetails,
  updateAnyProduct,
  deleteAnyProduct,
  featureProduct,
  unfeatureProduct,
  // Categories
  createCategory,
  updateCategory,
  deleteCategory,
  // Orders
  listAllOrders,
  getAnyOrderDetails,
  updateAnyOrderStatus,
  processOrderRefund,
  // Reviews
  listAllReviews,
  deleteAnyReview,
  updateReviewStatus,
  // Stats
  getStats,
};
