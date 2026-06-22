import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PageNotFound from "./pages/PageNotFound";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Customer child pages
import ProductBrowse from "./components/customer/ProductBrowse";
import ProductDetail from "./components/customer/ProductDetail";
import MyCart from "./components/customer/MyCart";
import MyOrders from "./components/customer/MyOrders";
import CustomerProfile from "./components/customer/CustomerProfile";
import MyReviews from "./components/customer/MyReviews";

// Seller child pages
import SellerProducts from "./components/seller/SellerProducts";
import AddProduct from "./components/seller/AddProduct";
import SellerOrders from "./components/seller/SellerOrders";
import SellerProfile from "./components/seller/SellerProfile";

// Admin child pages
import ManageSellers from "./components/admin/ManageSellers";
import ManageCustomers from "./components/admin/ManageCustomers";
import ManageCategories from "./components/admin/ManageCategories";
import AllOrders from "./components/admin/AllOrders";
import SalesReport from "./components/admin/SalesReport";

// Registration pages
import CustomerRegister from "./pages/CustomerRegister";
import SellerRegister from "./pages/SellerRegister";
import ResetPassword from "./pages/ResetPassword";

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Auth />}></Route>
        <Route path="/register/customer" element={<CustomerRegister />}></Route>
        <Route path="/register/seller" element={<SellerRegister />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>

        {/* Customer Dashboard with nested routes */}
        <Route path="/customer" element={<CustomerDashboard />}>
          <Route path="" element={<ProductBrowse />}></Route>
          <Route path="product/:id" element={<ProductDetail />}></Route>
          <Route path="cart" element={<MyCart />}></Route>
          <Route path="orders" element={<MyOrders />}></Route>
          <Route path="profile" element={<CustomerProfile />}></Route>
          <Route path="reviews" element={<MyReviews />}></Route>
        </Route>

        {/* Seller Dashboard with nested routes */}
        <Route path="/seller" element={<SellerDashboard />}>
          <Route path="" element={<SellerProducts />}></Route>
          <Route path="add-product" element={<AddProduct />}></Route>
          <Route path="orders" element={<SellerOrders />}></Route>
          <Route path="profile" element={<SellerProfile />}></Route>
        </Route>

        {/* Admin Dashboard with nested routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="" element={<ManageSellers />}></Route>
          <Route path="customers" element={<ManageCustomers />}></Route>
          <Route path="categories" element={<ManageCategories />}></Route>
          <Route path="orders" element={<AllOrders />}></Route>
          <Route path="sales-report" element={<SalesReport />}></Route>
        </Route>

        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  )
}

export default App;
