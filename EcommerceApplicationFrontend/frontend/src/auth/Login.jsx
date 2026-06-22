import axios from "axios"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState()

    const loginApi = "http://localhost:8088/api/auth/login"
    const userDetailsApi = "http://localhost:8088/api/auth/user-details"
    const navigate = useNavigate()

    const onLogin = async (e) => {
        e.preventDefault()
        // Prepare the header
        const config = {
            headers: {
                'Authorization': "Basic " + window.btoa(username + ":" + password)
            }
        }
        try {
            const response = await axios.get(loginApi, config)
            console.log(response.data)
            let token = response.data.token
            // Save this in localStorage along with username
            localStorage.setItem("token", token)
            localStorage.setItem("username", username)

            // Prepare the header
            const config_details = {
                headers: {
                    'Authorization': "Bearer " + token
                }
            }
            // Fetch User Details
            const resp = await axios.get(userDetailsApi, config_details)
            console.log(resp.data)
            let role = resp.data.role
            switch (role) {
                case 'CUSTOMER': navigate('/customer'); break;
                case 'SELLER':   navigate('/seller');   break;
                case 'ADMIN':    navigate('/admin');    break;
                default:         setErrMsg("Invalid credentials"); break;
            }
        }
        catch (err) {
            setErrMsg("Invalid credentials")
        }
    }

    return (
        <div style={{ background:'linear-gradient(135deg,#eff6ff,#f0f9ff)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:'100%', maxWidth:'440px', padding:'0 1rem' }}>
                {/* Logo */}
                <div className="text-center mb-4">
                    <span className="quitq-logo logo-public" style={{ fontSize:'1.2rem', padding:'8px 24px' }}>QuitQ</span>
                    <p className="text-muted mt-2 small">Sign in to your account</p>
                </div>

                <div className="card border-0" style={{ borderRadius:'1rem', boxShadow:'0 4px 24px rgba(59,130,246,0.12)', border:'1.5px solid #bfdbfe' }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4" style={{ color:'#0f2942' }}>Login to QuitQ</h5>
                        <form onSubmit={(e) => onLogin(e)}>
                            {
                                errMsg !== undefined ?
                                    <div className="alert border-0 mb-3" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem', fontSize:'.88rem' }}>
                                        <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                    </div> : ""
                            }
                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Username</label>
                                <input type="text" className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                    placeholder="Enter your username"
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Password</label>
                                <input type="password" className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn w-100 fw-bold text-white"
                                style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.6rem', padding:'10px', boxShadow:'0 3px 12px rgba(59,130,246,0.3)' }}>
                                <i className="bi bi-box-arrow-in-right me-2"></i>Login
                            </button>
                        </form>
                        <hr style={{ borderColor:'#bfdbfe' }} />
                        <div className="text-center small" style={{ color:'#64748b' }}>
                            New here?&nbsp;
                            <Link to="/register/customer" style={{ color:'#3b82f6', fontWeight:600 }}>Register as Customer</Link>
                            &nbsp;or&nbsp;
                            <Link to="/register/seller" style={{ color:'#0ea5e9', fontWeight:600 }}>Register as Seller</Link>
                        </div>
                        <div className="text-center mt-2 small">
                            <Link to="/reset-password" style={{ color:'#64748b', fontWeight:500 }}><i className="bi bi-shield-lock me-1"></i>Forgot Password?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
