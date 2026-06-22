import { Link } from "react-router-dom"

const SidebarCustomer = () => {
    const username = localStorage.getItem('username')
    return (
        <aside className="quitq-sidebar">
            <div>
                <div className="sidebar-profile">
                    <div className="sidebar-avatar avatar-customer">
                        <i className="bi bi-person-fill"></i>
                        <span className="avatar-dot"></span>
                    </div>
                    <div className="fw-bold" style={{ color: '#0f2942', fontSize: '.92rem' }}>{username}</div>
                    <span className="role-badge role-customer">Customer</span>
                </div>
                <Link to="/customer" className="sidebar-nav-btn">
                    <i className="bi bi-shop me-2"></i>Browse Products
                </Link>
                <Link to="/customer/cart" className="sidebar-nav-btn">
                    <i className="bi bi-cart3 me-2"></i>My Cart
                </Link>
                <Link to="/customer/orders" className="sidebar-nav-btn">
                    <i className="bi bi-bag-check me-2"></i>My Orders
                </Link>
                <Link to="/customer/reviews" className="sidebar-nav-btn">
                    <i className="bi bi-star me-2"></i>My Reviews
                </Link>
                <Link to="/customer/profile" className="sidebar-nav-btn">
                    <i className="bi bi-person me-2"></i>Profile
                </Link>
            </div>
            <div className="text-center mt-3">
            </div>
        </aside>
    )
}

export default SidebarCustomer
