import { Link, useNavigate } from "react-router-dom"

const NavbarAdmin = () => {
    const navigate = useNavigate()
    const logout = () => { localStorage.clear(); navigate("/login") }
    const username = localStorage.getItem('username')

    return (
        <nav className="quitq-navbar">
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-logo logo-admin">QuitQ</span>
                <Link to="/admin" className="quitq-nav-link">Sellers</Link><Link to="/admin/customers" className="quitq-nav-link">Customers</Link><Link to="/admin/categories" className="quitq-nav-link">Categories</Link><Link to="/admin/orders" className="quitq-nav-link">All Orders</Link>
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

export default NavbarAdmin
