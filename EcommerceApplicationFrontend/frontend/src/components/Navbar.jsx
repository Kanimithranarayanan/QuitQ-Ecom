import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="quitq-navbar">
            <div className="d-flex align-items-center gap-3">
                <span className="quitq-logo logo-public">QuitQ</span>
                <Link to="/" className="quitq-nav-link">Home</Link>
            </div>
            <div className="d-flex gap-2">
                <Link to="/register/customer">
                    <button className="btn btn-sm fw-semibold"
                        style={{ background:'#dbeafe', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:'.5rem' }}>
                        Register as Customer
                    </button>
                </Link>
                <Link to="/register/seller">
                    <button className="btn btn-sm fw-semibold"
                        style={{ background:'#cffafe', color:'#155e75', border:'1px solid #a5f3fc', borderRadius:'.5rem' }}>
                        Register as Seller
                    </button>
                </Link>
                <Link to="/login">
                    <button className="btn btn-sm fw-bold text-white"
                        style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.5rem' }}>
                        Login
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
