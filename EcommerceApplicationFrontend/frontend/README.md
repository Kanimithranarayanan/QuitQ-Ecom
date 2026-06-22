# QuitQ Ecom UI

React frontend for the QuitQ E-Commerce application.

## Tech Stack
- React 19 + Vite
- React Router DOM v7
- Axios for API calls
- Bootstrap 5 + Bootstrap Icons
- PrimeReact

## Project Structure

```
src/
├── auth/
│   └── Login.jsx                  # Basic Auth login → JWT flow
├── assets/css/
│   └── quitq_module_style.css     # Dashboard styles
├── components/
│   ├── Navbar.jsx                 # Public navbar
│   ├── Navbar-Customer.jsx
│   ├── Navbar-Seller.jsx
│   ├── Navbar-Admin.jsx
│   ├── customer/
│   │   ├── SidebarCustomer.jsx
│   │   ├── ProductBrowse.jsx      # Browse, search, filter products
│   │   ├── ProductDetail.jsx      # Product detail + place order
│   │   ├── MyCart.jsx             # Cart management
│   │   ├── MyOrders.jsx           # Order history
│   │   └── CustomerProfile.jsx
│   ├── seller/
│   │   ├── SidebarSeller.jsx
│   │   ├── SellerProducts.jsx     # List + delete products
│   │   ├── AddProduct.jsx         # Add new product form
│   │   ├── SellerOrders.jsx       # View + update order status
│   │   └── SellerProfile.jsx
│   └── admin/
│       ├── SidebarAdmin.jsx
│       ├── ManageSellers.jsx      # View + delete sellers
│       ├── ManageCustomers.jsx    # View + delete customers
│       ├── ManageCategories.jsx   # Add + delete categories
│       └── AllOrders.jsx          # View all orders + filter by status
├── pages/
│   ├── Home.jsx
│   ├── Auth.jsx
│   ├── CustomerRegister.jsx
│   ├── SellerRegister.jsx
│   ├── CustomerDashboard.jsx      # Layout: Navbar + Sidebar + <Outlet />
│   ├── SellerDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── PageNotFound.jsx
├── App.jsx                        # All routes defined here
└── main.jsx
```

## Setup & Run

```bash
npm install
npm run dev
```

App runs at: http://localhost:5173

## Backend
Spring Boot backend runs at: http://localhost:8088

## API Base URL
All API calls use: `http://localhost:8088`

## Auth Flow
1. Login sends `Basic Auth` to `/api/auth/login` → receives JWT token
2. Token stored in `localStorage`
3. All protected API calls use `Bearer <token>` header
4. User role fetched from `/api/auth/user-details` → navigate to correct dashboard
