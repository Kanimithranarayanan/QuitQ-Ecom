import { Link, useNavigate } from "react-router-dom"

const NavbarSeller = () => {
    const navigate = useNavigate()
    const logout = () => { localStorage.clear(); navigate("/login") }
    const username = localStorage.getItem('username')

    return (
        <nav className="quitq-navbar">
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-logo logo-seller">QuitQ</span>
                <Link to="/seller" className="quitq-nav-link">My Products</Link><Link to="/seller/add-product" className="quitq-nav-link">Add Product</Link><Link to="/seller/orders" className="quitq-nav-link">Orders</Link><Link to="/seller/profile" className="quitq-nav-link">Profile</Link>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-user-badge">👤 {username}</span>
                <button className="btn btn-sm fw-bold" onClick={() => logout()}
                    style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5', borderRadius:'.5rem' }}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
            </div>
        </nav>
    )
}

export default NavbarSeller
