import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAll, softDelete } from "../../store/action/customerAction"

const ManageCustomers = () => {
    /*
        state = {
            customers: []
        }
    */
    const { customers } = useSelector(state => state.customers)
    const dispatch = useDispatch()

    const [deleteMsg, setDeleteMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getAll()) // Dispatch an action
    }, [])

    const onDelete = async (id) => {
        try {
            // call api to delete
            await axios.delete("http://localhost:8088/api/customer/delete/" + id, config_details)
            // update the customers array — soft delete from local state (no API refetch)
            dispatch(softDelete(id))
            setDeleteMsg("Customer removed from the system.")
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Delete failed: " + (err.response?.data?.message || "Error"))
            setDeleteMsg(undefined)
        }
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-person-lines-fill me-2"></i>Manage Customers</span>
                    </div>

                    {
                        deleteMsg !== undefined ?
                            <div className="quitq-toast mb-3">
                                <span><i className="bi bi-check-circle me-2"></i>{deleteMsg}</span>
                                <button type="button" className="btn-close btn-close-sm" onClick={() => setDeleteMsg(undefined)}></button>
                            </div> : ""
                    }
                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem' }}>{errMsg}</div> : ""
                    }

                    {
                        customers.length > 0 ?
                            <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(29,78,216,0.08)' }}>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background:'#eff6ff' }}>
                                                {['ID','Name','Username','Gender','Contact','Address','Action'].map((h,i) => (
                                                    <th key={i} style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                customers.map((c, index) => (
                                                    <tr key={index}>
                                                        <td style={{ color:'#64748b' }}>{c.customerId}</td>
                                                        <td className="fw-semibold" style={{ color:'#0f2942' }}>{c.name}</td>
                                                        <td style={{ color:'#64748b' }}>{c.username}</td>
                                                        <td className="text-muted small">{c.gender}</td>
                                                        <td className="text-muted small">{c.contactNumber}</td>
                                                        <td className="text-muted small">{c.address}</td>
                                                        <td>
                                                            <button className="btn btn-link p-0 text-decoration-none"
                                                                style={{ color:'#ef4444' }}
                                                                onClick={() => onDelete(c.customerId)}>
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div> :
                            <div className="text-center py-5" style={{ color:'#94a3b8' }}>
                                <i className="bi bi-people" style={{ fontSize:'3rem', color:'#bfdbfe', display:'block', marginBottom:'1rem' }}></i>
                                <p>No customers registered yet.</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageCustomers
