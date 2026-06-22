import NavbarCustomer from "../components/Navbar-Customer"
import SidebarCustomer from "../components/customer/SidebarCustomer"
import { Outlet } from "react-router-dom"
import '../assets/css/quitq_module_style.css'

const CustomerDashboard = () => {
    return (
        <div style={{ background:'#f0f9ff', minHeight:'100vh', padding:'1rem' }}>
            <NavbarCustomer />
            <div className="d-flex gap-3 align-items-stretch">
                <SidebarCustomer />
                <div className="flex-grow-1">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default CustomerDashboard
