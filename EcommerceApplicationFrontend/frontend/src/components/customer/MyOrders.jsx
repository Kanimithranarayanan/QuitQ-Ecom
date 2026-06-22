import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyOrders } from "../../store/action/orderAction"

const MyOrders = () => {
    const { orders } = useSelector(state => state.orders)
    const dispatch = useDispatch()

    const [cancelMsg, setCancelMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getMyOrders())
    }, [])

    const onCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return
        try {
            await axios.put(
                "http://localhost:8088/api/order/cancel/" + orderId,
                {},
                config_details
            )
            setCancelMsg("Order #" + orderId + " cancelled successfully. Stock has been restored.")
            setErrMsg(undefined)
            // Refresh orders list
            dispatch(getMyOrders())
        } catch (err) {
            setErrMsg("Cancel failed: " + (err.response?.data?.message || "Error"))
            setCancelMsg(undefined)
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PLACED':      return { background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }
            case 'PROCESSING':  return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }
            case 'SHIPPED':     return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }
            case 'DELIVERED':   return { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }
            case 'CANCELLED':   return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }
            default:            return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
        }
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-bag-check me-2"></i>My Orders</span>
                    </div>

                    {
                        cancelMsg !== undefined ?
                            <div className="quitq-toast mb-3">
                                <span><i className="bi bi-check-circle me-2"></i>{cancelMsg}</span>
                                <button type="button" className="btn-close btn-close-sm" onClick={() => setCancelMsg(undefined)}></button>
                            </div> : ""
                    }
                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3" style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>
                                <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                            </div> : ""
                    }

                    {
                        orders.length > 0 ?
                            <div className="card border-0" style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)' }}>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background: '#eff6ff' }}>
                                                {['Order ID', 'Product', 'Qty', 'Total', 'Shipping Address', 'Status', 'Date', 'Action'].map((h, i) => (
                                                    <th key={i} style={{ color: '#1e40af', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orders.map((o, index) => (
                                                    <tr key={index}>
                                                        <td className="fw-semibold" style={{ color: '#1d4ed8' }}>#{o.orderId}</td>
                                                        <td style={{ color: '#0f2942' }}>{o.productName}</td>
                                                        <td>{o.quantity}</td>
                                                        <td className="fw-bold" style={{ color: '#1d4ed8' }}>₹{o.totalAmount}</td>
                                                        <td className="text-muted small">{o.shippingAddress}</td>
                                                        <td>
                                                            <span style={{
                                                                ...getStatusStyle(o.orderStatus),
                                                                borderRadius: '.4rem',
                                                                padding: '2px 10px',
                                                                fontSize: '.78rem',
                                                                fontWeight: 700
                                                            }}>
                                                                {o.orderStatus}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted small">{new Date(o.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            {
                                                                o.orderStatus === 'PLACED' ?
                                                                    <button
                                                                        className="btn btn-sm fw-semibold"
                                                                        style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '.4rem', fontSize: '.78rem', padding: '2px 10px' }}
                                                                        onClick={() => onCancel(o.orderId)}>
                                                                        <i className="bi bi-x-circle me-1"></i>Cancel
                                                                    </button>
                                                                    : <span className="text-muted small">—</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div> :
                            <div className="text-center py-5" style={{ color: '#94a3b8' }}>
                                <i className="bi bi-bag-x" style={{ fontSize: '3rem', color: '#bfdbfe', display: 'block', marginBottom: '1rem' }}></i>
                                <p>No orders placed yet.</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyOrders
