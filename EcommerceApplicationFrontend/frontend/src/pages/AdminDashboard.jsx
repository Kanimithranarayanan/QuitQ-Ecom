import NavbarAdmin from "../components/Navbar-Admin"
import SidebarAdmin from "../components/admin/SidebarAdmin"
import { Outlet } from "react-router-dom"
import '../assets/css/quitq_module_style.css'

const AdminDashboard = () => {
    return (
        <div style={{ background:'#f0f9ff', minHeight:'100vh', padding:'1rem' }}>
            <NavbarAdmin />
            <div className="d-flex gap-3 align-items-stretch">
                <SidebarAdmin />
                <div className="flex-grow-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
