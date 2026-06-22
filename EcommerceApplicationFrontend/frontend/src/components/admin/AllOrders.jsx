import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { getAll } from "../../store/action/orderAction"

const AllOrders = () => {
    /*
        state = {
            orders: []
        }
    */
    const { orders } = useSelector(state => state.orders)
    const dispatch = useDispatch()

    const [filterStatus, setFilterStatus] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const byStatusApi = "http://localhost:8088/api/order/by-status"
    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getAll()) // Dispatch an action
    }, [])

    const onFilterByStatus = async (status) => {
        setFilterStatus(status)
        if (status === "") {
            dispatch(getAll())
            return
        }
        try {
            const response = await axios.get(byStatusApi + "?orderStatus=" + status, config_details)
            // manually dispatch to store
            dispatch({ type: 'ORDER_GET_ALL', payload: response.data })
        }
        catch (err) { setErrMsg("Filter failed") }
    }

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(
                "http://localhost:8088/api/order/update-status/" + orderId + "?orderStatus=" + newStatus,
                {}, config_details
            )
            setSuccessMsg("Order #" + orderId + " updated to " + newStatus)
            setErrMsg(undefined)
            // Refresh with current filter
            if (filterStatus === "") {
                dispatch(getAll())
            } else {
                onFilterByStatus(filterStatus)
            }
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
                        <span><i className="bi bi-clipboard-data me-2"></i>All Orders</span>
                        <div className="d-flex align-items-center gap-2">
                            <label className="small fw-semibold mb-0" style={{ color:'#1e3a5f' }}>Filter:</label>
                            <select className="form-control form-control-sm" style={{ width:'150px', borderColor:'#bfdbfe', borderRadius:'.4rem' }}
                                onChange={(e) => onFilterByStatus(e.target.value)} value={filterStatus}>
                                <option value="">All Orders</option>
                                <option value="PLACED">PLACED</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                    </div>

                    {
                        successMsg !== undefined ?
                            <div className="quitq-toast mb-3">
                                <span><i className="bi bi-check-circle me-2"></i>{successMsg}</span>
                                <button type="button" className="btn-close btn-close-sm" onClick={() => setSuccessMsg(undefined)}></button>
                            </div> : ""
                    }
                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem' }}>{errMsg}</div> : ""
                    }

                    <p className="small mb-3" style={{ color:'#94a3b8' }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Orders can only be cancelled by the customer who placed them.
                    </p>

                    {
                        orders.length > 0 ?
                            <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(29,78,216,0.08)' }}>
                                <div className="card-body p-0">
                                    <div style={{ overflowX:'auto' }}>
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr style={{ background:'#eff6ff' }}>
                                                    {['Order ID','Product','Customer','Qty','Total','Shipping','Status','Update','Date'].map((h,i) => (
                                                        <th key={i} style={{ color:'#1e40af', fontSize:'.78rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe', whiteSpace:'nowrap' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orders.map((o, index) => (
                                                        <tr key={index}>
                                                            <td className="fw-semibold" style={{ color:'#1d4ed8' }}>#{o.orderId}</td>
                                                            <td style={{ color:'#0f2942' }}>{o.productName}</td>
                                                            <td style={{ color:'#64748b' }}>{o.customerName}</td>
                                                            <td>{o.quantity}</td>
                                                            <td className="fw-bold" style={{ color:'#1d4ed8' }}>₹{o.totalAmount}</td>
                                                            <td className="text-muted small" style={{ maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.shippingAddress}</td>
                                                            <td><span className={"status-" + o.orderStatus}>{o.orderStatus}</span></td>
                                                            <td>
                                                                <select className="form-control form-control-sm" style={{ borderColor:'#bfdbfe', borderRadius:'.4rem', fontSize:'.8rem', minWidth:'120px' }}
                                                                    value={o.orderStatus}
                                                                    onChange={(e) => updateStatus(o.orderId, e.target.value)}
                                                                    disabled={o.orderStatus === 'CANCELLED'}>
                                                                    <option value="PLACED">PLACED</option>
                                                                    <option value="PROCESSING">PROCESSING</option>
                                                                    <option value="SHIPPED">SHIPPED</option>
                                                                    <option value="DELIVERED">DELIVERED</option>
                                                                    {
                                                                        o.orderStatus === 'CANCELLED' ?
                                                                            <option value="CANCELLED">CANCELLED</option> : ""
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td className="text-muted small" style={{ whiteSpace:'nowrap' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> :
                            <div className="text-center py-5" style={{ color:'#94a3b8' }}>
                                <i className="bi bi-clipboard-x" style={{ fontSize:'3rem', color:'#bfdbfe', display:'block', marginBottom:'1rem' }}></i>
                                <p>No orders found.</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllOrders
