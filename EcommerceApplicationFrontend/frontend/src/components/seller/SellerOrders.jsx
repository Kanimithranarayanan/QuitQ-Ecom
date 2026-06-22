import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { getSellerOrders } from "../../store/action/orderAction"

const SellerOrders = () => {
    /*
        state = {
            orders: []
        }
    */
    const { orders } = useSelector(state => state.orders)
    const dispatch = useDispatch()

    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getSellerOrders()) // Dispatch an action
    }, [])

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(
                "http://localhost:8088/api/order/update-status/" + orderId + "?orderStatus=" + newStatus,
                {}, config_details
            )
            setSuccessMsg("Order #" + orderId + " updated to " + newStatus)
            setErrMsg(undefined)
            dispatch(getSellerOrders()) // Refresh after update
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
                        <span><i className="bi bi-receipt me-2"></i>Orders for My Products</span>
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
                            <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(14,165,233,0.09)' }}>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background:'#f0f9ff' }}>
                                                {['Order ID','Product','Customer','Qty','Total','Status','Update Status','Date'].map((h,i) => (
                                                    <th key={i} style={{ color:'#155e75', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #a5f3fc' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orders.map((o, index) => (
                                                    <tr key={index}>
                                                        <td className="fw-semibold" style={{ color:'#0ea5e9' }}>#{o.orderId}</td>
                                                        <td style={{ color:'#0f2942' }}>{o.productName}</td>
                                                        <td style={{ color:'#64748b' }}>{o.customerName}</td>
                                                        <td>{o.quantity}</td>
                                                        <td className="fw-bold" style={{ color:'#0ea5e9' }}>₹{o.totalAmount}</td>
                                                        <td><span className={"status-" + o.orderStatus}>{o.orderStatus}</span></td>
                                                        <td>
                                                            <select className="form-control form-control-sm" style={{ borderColor:'#a5f3fc', borderRadius:'.4rem', fontSize:'.82rem' }}
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
                                                        <td className="text-muted small">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div> :
                            <div className="text-center py-5" style={{ color:'#94a3b8' }}>
                                <i className="bi bi-receipt" style={{ fontSize:'3rem', color:'#a5f3fc', display:'block', marginBottom:'1rem' }}></i>
                                <p>No orders received yet.</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerOrders
