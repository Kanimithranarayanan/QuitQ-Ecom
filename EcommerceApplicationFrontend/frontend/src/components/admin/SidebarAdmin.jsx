import { Link } from "react-router-dom"

const SidebarAdmin = () => {
    const username = localStorage.getItem('username')
    return (
        <aside className="quitq-sidebar">
            <div>
                <div className="sidebar-profile">
                    <div className="sidebar-avatar avatar-admin">
                        <i className="bi bi-shield-fill"></i>
                        <span className="avatar-dot"></span>
                    </div>
                    <div className="fw-bold" style={{ color:'#0f2942', fontSize:'.92rem' }}>{username}</div>
                    <span className="role-badge role-admin">Administrator</span>
                </div>
                <Link to="/admin" className="sidebar-nav-btn"><i className="bi bi-people me-2"></i>Manage Sellers</Link>
                <Link to="/admin/customers" className="sidebar-nav-btn"><i className="bi bi-person-lines-fill me-2"></i>Manage Customers</Link>
                <Link to="/admin/categories" className="sidebar-nav-btn"><i className="bi bi-tags me-2"></i>Categories</Link>
                <Link to="/admin/orders" className="sidebar-nav-btn"><i className="bi bi-clipboard-data me-2"></i>All Orders</Link>
                <Link to="/admin/sales-report" className="sidebar-nav-btn"><i className="bi bi-graph-up-arrow me-2"></i>Sales Report</Link>
            </div>
            <div className="text-center mt-3">
            </div>
        </aside>
    )
}
export default SidebarAdmin
