import axios from "axios"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const SellerRegister = () => {
    const [name, setName] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [address, setAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const registerApi = "http://localhost:8088/api/seller/add"
    const navigate = useNavigate()

    const onRegister = async (e) => {
        e.preventDefault()
        let body = { 'name': name, 'contactNumber': contactNumber,
                     'address': address, 'username': username, 'password': password }
        try {
            const response = await axios.post(registerApi, body)
            console.log(response.data)
            setSuccessMsg("Seller registration successful! Redirecting to login...")
            setErrMsg(undefined)
            setTimeout(() => navigate('/login'), 2000)
        }
        catch (err) {
            setErrMsg("Registration failed: " + (err.response?.data?.message || "Please check your details"))
            setSuccessMsg(undefined)
        }
    }

    return (
        <div style={{ background:'linear-gradient(135deg,#f0f9ff,#cffafe)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem' }}>
            <div style={{ width:'100%', maxWidth:'560px' }}>
                <div className="text-center mb-4">
                    <span className="quitq-logo logo-seller" style={{ fontSize:'1.1rem', padding:'7px 22px' }}>QuitQ</span>
                    <p className="text-muted mt-2 small">Create your seller account and start selling</p>
                </div>
                <div className="card border-0" style={{ borderRadius:'1rem', boxShadow:'0 4px 24px rgba(14,165,233,0.14)', border:'1.5px solid #a5f3fc' }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4" style={{ color:'#0f2942' }}>Seller Registration</h5>
                        <form onSubmit={(e) => onRegister(e)}>
                            {
                                successMsg !== undefined ?
                                    <div className="alert border-0 mb-3" style={{ background:'#d1fae5', color:'#065f46', borderRadius:'.5rem', fontSize:'.88rem' }}>
                                        <i className="bi bi-check-circle me-2"></i>{successMsg}
                                    </div> : ""
                            }
                            {
                                errMsg !== undefined ?
                                    <div className="alert border-0 mb-3" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem', fontSize:'.88rem' }}>
                                        <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                    </div> : ""
                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Business / Full Name</label>
                                        <input type="text" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                            required onChange={(e) => setName(e.target.value)} value={name} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Contact Number</label>
                                        <input type="text" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                            onChange={(e) => setContactNumber(e.target.value)} value={contactNumber} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Username</label>
                                        <input type="text" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                            required onChange={(e) => setUsername(e.target.value)} value={username} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Password</label>
                                        <input type="password" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                            required onChange={(e) => setPassword(e.target.value)} value={password} />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Address</label>
                                <textarea className="form-control" rows="2" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                    onChange={(e) => setAddress(e.target.value)} value={address}></textarea>
                            </div>
                            <button type="submit" className="btn w-100 fw-bold text-white mb-2"
                                style={{ background:'linear-gradient(135deg,#0ea5e9,#06b6d4)', border:'none', borderRadius:'.6rem', padding:'10px', boxShadow:'0 3px 12px rgba(14,165,233,0.3)' }}>
                                <i className="bi bi-shop me-2"></i>Register as Seller
                            </button>
                        </form>
                        <div className="text-center small mt-2" style={{ color:'#64748b' }}>
                            Already have an account?&nbsp;
                            <Link to="/login" style={{ color:'#0ea5e9', fontWeight:600 }}>Login here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerRegister
