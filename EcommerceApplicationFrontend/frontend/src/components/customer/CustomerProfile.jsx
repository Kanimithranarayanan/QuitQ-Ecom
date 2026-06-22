import axios from "axios"
import { useEffect, useState } from "react"

const CustomerProfile = () => {
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [address, setAddress] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const profileApi = "http://localhost:8088/api/customer/profile"
    const updateApi = "http://localhost:8088/api/customer/update-profile"

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(profileApi, config_details)
                setName(response.data.name)
                setGender(response.data.gender || "")
                setContactNumber(response.data.contactNumber || "")
                setAddress(response.data.address || "")
            }
            catch (err) { setErrMsg("Failed to load profile") }
        }
        getProfile()
    }, [])

    const onUpdate = async (e) => {
        e.preventDefault()
        let body = { 'name': name, 'gender': gender, 'contactNumber': contactNumber, 'address': address }
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
                        <span><i className="bi bi-person me-2"></i>My Profile</span>
                    </div>
                    <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(59,130,246,0.07)' }}>
                        <div className="card-header" style={{ background:'#eff6ff', borderBottom:'1.5px solid #bfdbfe', borderRadius:'.75rem .75rem 0 0', color:'#1e40af', fontWeight:700, fontSize:'.9rem' }}>
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
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Full Name</label>
                                            <input type="text" className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                                required onChange={(e) => setName(e.target.value)} value={name} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Gender</label>
                                            <select className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                                onChange={(e) => setGender(e.target.value)} value={gender}>
                                                <option value="">---Select Gender---</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Contact Number</label>
                                    <input type="text" className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                        onChange={(e) => setContactNumber(e.target.value)} value={contactNumber} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Address</label>
                                    <textarea className="form-control" rows="3" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                        onChange={(e) => setAddress(e.target.value)} value={address}></textarea>
                                </div>
                                <button type="submit" className="btn fw-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.6rem', padding:'8px 24px' }}>
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

export default CustomerProfile
