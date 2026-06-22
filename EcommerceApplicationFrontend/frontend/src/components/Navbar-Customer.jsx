import { Link, useNavigate } from "react-router-dom"

const NavbarCustomer = () => {
    const navigate = useNavigate()
    const logout = () => { localStorage.clear(); navigate("/login") }
    const username = localStorage.getItem('username')

    return (
        <nav className="quitq-navbar">
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-logo logo-customer">QuitQ</span>
                <Link to="/customer" className="quitq-nav-link">
                    <i className="bi bi-shop me-1"></i>Browse
                </Link>
                <Link to="/customer/cart" className="quitq-nav-link">
                    <i className="bi bi-cart3 me-1"></i>Cart
                </Link>
                <Link to="/customer/orders" className="quitq-nav-link">My Orders</Link>
                <Link to="/customer/reviews" className="quitq-nav-link">
                    <i className="bi bi-star me-1"></i>My Reviews
                </Link>
                <Link to="/customer/profile" className="quitq-nav-link">Profile</Link>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-user-badge">👤 {username}</span>
                <button className="btn btn-sm fw-bold" onClick={() => logout()}
                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '.5rem' }}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
            </div>
        </nav>
    )
}

export default NavbarCustomer
