import { Link } from "react-router-dom"

const SidebarSeller = () => {
    const username = localStorage.getItem('username')
    return (
        <aside className="quitq-sidebar">
            <div>
                <div className="sidebar-profile">
                    <div className="sidebar-avatar avatar-seller">
                        <i className="bi bi-shop-window"></i>
                        <span className="avatar-dot"></span>
                    </div>
                    <div className="fw-bold" style={{ color:'#0f2942', fontSize:'.92rem' }}>{username}</div>
                    <span className="role-badge role-seller">Seller</span>
                </div>
                <Link to="/seller" className="sidebar-nav-btn"><i className="bi bi-box-seam me-2"></i>My Products</Link>
                <Link to="/seller/add-product" className="sidebar-nav-btn"><i className="bi bi-plus-circle me-2"></i>Add Product</Link>
                <Link to="/seller/orders" className="sidebar-nav-btn"><i className="bi bi-receipt me-2"></i>Orders</Link>
                <Link to="/seller/profile" className="sidebar-nav-btn"><i className="bi bi-person me-2"></i>Profile</Link>
            </div>
            <div className="text-center mt-3">
            </div>
        </aside>
    )
}
export default SidebarSeller
