import NavbarSeller from "../components/Navbar-Seller"
import SidebarSeller from "../components/seller/SidebarSeller"
import { Outlet } from "react-router-dom"
import '../assets/css/quitq_module_style.css'

const SellerDashboard = () => {
    return (
        <div style={{ background:'#f0f9ff', minHeight:'100vh', padding:'1rem' }}>
            <NavbarSeller />
            <div className="d-flex gap-3 align-items-stretch">
                <SidebarSeller />
                <div className="flex-grow-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default SellerDashboard
