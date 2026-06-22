import axios from "axios"
import { useEffect, useState } from "react"

const SellerProfile = () => {
    const [name, setName] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [address, setAddress] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const profileApi = "http://localhost:8088/api/seller/profile"
    const updateApi = "http://localhost:8088/api/seller/update-profile"

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(profileApi, config_details)
                setName(response.data.name)
                setContactNumber(response.data.contactNumber || "")
                setAddress(response.data.address || "")
            }
            catch (err) { setErrMsg("Failed to load profile") }
        }
        getProfile()
    }, [])

    const onUpdate = async (e) => {
        e.preventDefault()
        let body = { 'name': name, 'contactNumber': contactNumber, 'address': address }
        try {
            const response = await axios.put(updateApi, body, config_details)
            setSuccessMsg(response.data)
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Update failed: " + (err.response?.data?.message || "Error"))
            setSuccessMsg(undefined)
        }
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-person me-2"></i>Seller Profile</span>
                    </div>
                    <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(14,165,233,0.09)' }}>
                        <div className="card-header" style={{ background:'#f0f9ff', borderBottom:'1.5px solid #a5f3fc', borderRadius:'.75rem .75rem 0 0', color:'#155e75', fontWeight:700, fontSize:'.9rem' }}>
                            Update Profile
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={(e) => onUpdate(e)}>
                                {
                                    successMsg !== undefined ?
                                        <div className="alert border-0 mb-4" style={{ background:'#d1fae5', color:'#065f46', borderRadius:'.5rem' }}>
                                            <i className="bi bi-check-circle me-2"></i>{successMsg}
                                        </div> : ""
                                }
                                {
                                    errMsg !== undefined ?
                                        <div className="alert border-0 mb-4" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem' }}>
                                            <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                        </div> : ""
                                }
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Business / Full Name: </label>
                                    <input type="text" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                        required onChange={(e) => setName(e.target.value)} value={name} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Contact Number: </label>
                                    <input type="text" className="form-control" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                        onChange={(e) => setContactNumber(e.target.value)} value={contactNumber} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Address: </label>
                                    <textarea className="form-control" rows="3" style={{ borderColor:'#a5f3fc', borderRadius:'.5rem' }}
                                        onChange={(e) => setAddress(e.target.value)} value={address}></textarea>
                                </div>
                                <button type="submit" className="btn fw-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#0ea5e9,#06b6d4)', border:'none', borderRadius:'.6rem', padding:'8px 24px' }}>
                                    <i className="bi bi-save me-1"></i>Update Profile
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerProfile
