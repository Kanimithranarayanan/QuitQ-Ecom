import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <div style={{ background:'#f0f9ff', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
            <div>
                <div style={{ fontSize:'5rem', fontWeight:900, color:'#bfdbfe' }}>404</div>
                <h3 style={{ color:'#1e3a5f' }}>Page Not Found</h3>
                <p className="text-muted">The page you are looking for does not exist.</p>
                <Link to="/" className="btn fw-bold text-white"
                    style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.6rem' }}>
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound
