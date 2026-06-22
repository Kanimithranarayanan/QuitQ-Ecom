import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const ResetPassword = () => {
    const [username, setUsername] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const resetApi = "http://localhost:8088/api/auth/reset-password"

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrMsg(undefined)
        setSuccessMsg(undefined)

        if (newPassword !== confirmPassword) {
            setErrMsg("Passwords do not match")
            return
        }
        if (newPassword.length < 6) {
            setErrMsg("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            await axios.post(resetApi, { username, newPassword })
            setSuccessMsg("Password reset successfully! Redirecting to login...")
            setTimeout(() => navigate('/login'), 2500)
        } catch (err) {
            setErrMsg(err.response?.data?.message || "Reset failed. Please check your username and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '440px', padding: '0 1rem' }}>
                {/* Logo */}
                <div className="text-center mb-4">
                    <span className="quitq-logo logo-public" style={{ fontSize: '1.2rem', padding: '8px 24px' }}>QuitQ</span>
                    <p className="text-muted mt-2 small">Reset your password</p>
                </div>

                <div className="card border-0" style={{ borderRadius: '1rem', boxShadow: '0 4px 24px rgba(59,130,246,0.12)', border: '1.5px solid #bfdbfe' }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-1" style={{ color: '#0f2942' }}>Reset Password</h5>
                        <p className="text-muted small mb-4">Enter your username and choose a new password.</p>

                        {
                            successMsg !== undefined ?
                                <div className="alert border-0 mb-3" style={{ background: '#d1fae5', color: '#065f46', borderRadius: '.5rem', fontSize: '.88rem' }}>
                                    <i className="bi bi-check-circle me-2"></i>{successMsg}
                                </div> : ""
                        }
                        {
                            errMsg !== undefined ?
                                <div className="alert border-0 mb-3" style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem', fontSize: '.88rem' }}>
                                    <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                </div> : ""
                        }

                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    style={{ borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                    placeholder="At least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    style={{ borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                    placeholder="Repeat your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 fw-bold text-white"
                                disabled={loading}
                                style={{ background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', border: 'none', borderRadius: '.6rem', padding: '10px', boxShadow: '0 3px 12px rgba(59,130,246,0.3)' }}>
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</>
                                    : <><i className="bi bi-shield-lock me-2"></i>Reset Password</>
                                }
                            </button>
                        </form>

                        <hr style={{ borderColor: '#bfdbfe' }} />
                        <div className="text-center small" style={{ color: '#64748b' }}>
                            Remembered your password?&nbsp;
                            <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Back to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
