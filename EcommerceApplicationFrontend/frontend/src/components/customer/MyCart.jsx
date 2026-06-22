import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getMyCart, removeFromCart, clearCartLocal } from "../../store/action/cartAction"

// Delivery charge is 2% of the item total — kept in sync with the backend's
// DeliveryChargeUtility just for showing a live estimate before checkout;
// the real, authoritative amount always comes back from the server.
const DELIVERY_CHARGE_PERCENT = 2

const MyCart = () => {
    /*
        state = {
            cart: { items: [], grandTotal: 0 }
        }
    */
    const { cart } = useSelector(state => state.cart)
    const dispatch = useDispatch()

    const [deleteMsg, setDeleteMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [shippingAddress, setShippingAddress] = useState("")
    const [placingOrder, setPlacingOrder] = useState(false)
    const [orderSummary, setOrderSummary] = useState() // set after a successful checkout
    const navigate = useNavigate()

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getMyCart()) // Dispatch an action
    }, [])

    const onRemoveItem = async (cartId) => {
        try {
            // call api to delete
            await axios.delete("http://localhost:8088/api/cart/remove/" + cartId, config_details)
            // update the cart items array — soft delete from local state (no API refetch)
            dispatch(removeFromCart(cartId))
            setDeleteMsg("Item removed from cart.")
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Remove failed: " + (err.response?.data?.message || "Error"))
            setDeleteMsg(undefined)
        }
    }

    const updateQuantity = async (cartId, quantity) => {
        if (quantity < 1) return
        try {
            await axios.put("http://localhost:8088/api/cart/update/" + cartId + "?quantity=" + quantity, {}, config_details)
            dispatch(getMyCart()) // Refresh cart after update
        }
        catch (err) {
            setErrMsg("Update failed: " + (err.response?.data?.message || "Error"))
        }
    }

    const clearCart = async () => {
        if (!window.confirm("Clear all items from cart?")) return
        try {
            await axios.delete("http://localhost:8088/api/cart/clear", config_details)
            dispatch(getMyCart())
            setDeleteMsg("Cart cleared.")
        }
        catch (err) {
            setErrMsg("Failed to clear cart")
        }
    }

    // Total number of units across all cart items (e.g. 2 of Product A + 3 of Product B = 5)
    const totalQuantity = (cart.items || []).reduce((sum, item) => sum + item.quantity, 0)

    // Live estimate shown before checkout — the confirmed figures always
    // come from the server response after placing the order.
    const deliveryChargeEstimate = Math.round(cart.grandTotal * DELIVERY_CHARGE_PERCENT) / 100
    const payableEstimate = cart.grandTotal + deliveryChargeEstimate

    const placeOrder = async (e) => {
        e.preventDefault()
        if (!shippingAddress.trim()) {
            setErrMsg("Please enter a shipping address")
            return
        }
        setPlacingOrder(true)
        try {
            const body = {
                shippingAddress: shippingAddress,
                paymentMethod: "CASH_ON_DELIVERY"
            }
            const response = await axios.post("http://localhost:8088/api/order/checkout-cart", body, config_details)
            setOrderSummary(response.data)
            dispatch(clearCartLocal()) // cart is now empty on the backend too
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Order failed: " + (err.response?.data?.message || "Error"))
        }
        finally {
            setPlacingOrder(false)
        }
    }

    // ---- Center-of-page order confirmation, shown after a successful checkout ----
    if (orderSummary) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
                <div className="card border-0 p-4" style={{ maxWidth: '520px', width: '100%', borderRadius: '1rem', boxShadow: '0 8px 30px rgba(29,78,216,0.12)' }}>
                    <div className="text-center mb-3">
                        <i className="bi bi-bag-check-fill" style={{ fontSize: '3.5rem', color: '#10b981' }}></i>
                        <h4 className="fw-bold mt-3 mb-1" style={{ color: '#0f2942' }}>Order Placed Successfully!</h4>
                        <p className="text-muted small mb-0">Pay with cash when your order is delivered.</p>
                    </div>

                    <div className="card border-0 p-3 mb-3" style={{ background: '#eff6ff', borderRadius: '.75rem', border: '1.5px solid #bfdbfe' }}>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small fw-semibold" style={{ color: '#1e3a5f' }}>Total Items</span>
                            <span className="fw-bold" style={{ color: '#0f2942' }}>{orderSummary.totalQuantity}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="small" style={{ color: '#1e3a5f' }}>Item Total</span>
                            <span style={{ color: '#0f2942' }}>₹{orderSummary.itemsTotal}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small" style={{ color: '#1e3a5f' }}>Delivery Charge</span>
                            <span style={{ color: '#0f2942' }}>₹{orderSummary.deliveryTotal}</span>
                        </div>
                        <hr style={{ borderColor: '#bfdbfe', margin: '.25rem 0 .6rem' }} />
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small fw-semibold" style={{ color: '#1e3a5f' }}>Payment Method</span>
                            <span className="fw-bold" style={{ color: '#0f2942' }}>Cash on Delivery</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="fw-bold" style={{ color: '#1e3a5f' }}>Amount to Pay</span>
                            <span className="fw-black fs-5" style={{ color: '#1d4ed8' }}>₹{orderSummary.grandTotal}</span>
                        </div>
                    </div>

                    <div className="card border-0" style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)' }}>
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr style={{ background: '#eff6ff' }}>
                                        <th style={{ color: '#1e40af', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>Order ID</th>
                                        <th style={{ color: '#1e40af', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>Product</th>
                                        <th style={{ color: '#1e40af', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>Qty</th>
                                        <th style={{ color: '#1e40af', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderSummary.orders.map((o, index) => (
                                            <tr key={index}>
                                                <td className="fw-semibold small" style={{ color: '#1d4ed8' }}>#{o.orderId}</td>
                                                <td className="small" style={{ color: '#0f2942' }}>{o.productName}</td>
                                                <td className="small">{o.quantity}</td>
                                                <td className="fw-bold small" style={{ color: '#1d4ed8' }}>₹{o.grandTotal}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                        <button className="btn flex-fill fw-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', border: 'none', borderRadius: '.6rem' }}
                            onClick={() => navigate('/customer/orders')}>
                            <i className="bi bi-bag-check me-1"></i>View My Orders
                        </button>
                        <button className="btn flex-fill fw-semibold"
                            style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '.6rem' }}
                            onClick={() => navigate('/customer')}>
                            <i className="bi bi-shop me-1"></i>Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-cart3 me-2"></i>My Shopping Cart</span>
                        {
                            cart.items && cart.items.length > 0 ?
                                <button className="btn btn-sm fw-semibold"
                                    style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5', borderRadius:'.5rem' }}
                                    onClick={() => clearCart()}>
                                    <i className="bi bi-trash me-1"></i>Clear Cart
                                </button> : ""
                        }
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
                            <div className="alert border-0 mb-3" style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem', fontSize:'.88rem' }}>
                                {errMsg}
                            </div> : ""
                    }

                    {
                        cart.items && cart.items.length > 0 ?
                            <div>
                                <div className="card border-0" style={{ borderRadius:'.75rem', border:'1.5px solid #bfdbfe !important', boxShadow:'0 2px 10px rgba(59,130,246,0.07)' }}>
                                    <div className="card-body p-0">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr style={{ background:'#eff6ff' }}>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Product</th>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Seller</th>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Price</th>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Qty</th>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Total</th>
                                                    <th style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cart.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="fw-semibold" style={{ color:'#0f2942' }}>{item.productName}</td>
                                                            <td className="text-muted small">{item.sellerName}</td>
                                                            <td style={{ color:'#64748b' }}>₹{item.price}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <button className="btn btn-sm px-2 py-0"
                                                                        style={{ border:'1px solid #bfdbfe', borderRadius:'.4rem', color:'#1e40af' }}
                                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>−</button>
                                                                    <span className="fw-semibold">{item.quantity}</span>
                                                                    <button className="btn btn-sm px-2 py-0"
                                                                        style={{ border:'1px solid #bfdbfe', borderRadius:'.4rem', color:'#1e40af' }}
                                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                                                                </div>
                                                            </td>
                                                            <td className="fw-bold" style={{ color:'#1d4ed8' }}>₹{item.totalPrice}</td>
                                                            <td>
                                                                <button className="btn btn-link p-0 text-decoration-none"
                                                                    style={{ color:'#ef4444' }}
                                                                    onClick={() => onRemoveItem(item.cartId)}>
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Order Summary + Checkout */}
                                <div className="row mt-4">
                                    <div className="col-md-6 offset-md-6">
                                        <div className="card border-0 p-3" style={{ background:'#eff6ff', borderRadius:'.75rem', border:'1.5px solid #bfdbfe' }}>
                                            <h6 className="fw-bold mb-3" style={{ color:'#0f2942' }}>
                                                <i className="bi bi-receipt me-2"></i>Order Summary
                                            </h6>

                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small fw-semibold" style={{ color:'#1e3a5f' }}>Items in Cart</span>
                                                <span className="fw-semibold" style={{ color:'#0f2942' }}>{cart.items.length}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small fw-semibold" style={{ color:'#1e3a5f' }}>Total Quantity</span>
                                                <span className="fw-semibold" style={{ color:'#0f2942' }}>{totalQuantity}</span>
                                            </div>
                                            <hr style={{ borderColor:'#bfdbfe' }} />
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small" style={{ color:'#1e3a5f' }}>Item Total</span>
                                                <span style={{ color:'#0f2942' }}>₹{cart.grandTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="small" style={{ color:'#1e3a5f' }}>Delivery Charge ({DELIVERY_CHARGE_PERCENT}%)</span>
                                                <span style={{ color:'#0f2942' }}>₹{deliveryChargeEstimate.toFixed(2)}</span>
                                            </div>
                                            <hr style={{ borderColor:'#bfdbfe' }} />
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="fw-bold" style={{ color:'#1e3a5f' }}>Total Payable:</span>
                                                <span className="fw-black fs-5" style={{ color:'#1d4ed8' }}>₹{payableEstimate.toFixed(2)}</span>
                                            </div>

                                            <form onSubmit={(e) => placeOrder(e)}>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>
                                                        Shipping Address
                                                    </label>
                                                    <textarea className="form-control" rows="2"
                                                        style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                                        required
                                                        onChange={(e) => setShippingAddress(e.target.value)}
                                                        value={shippingAddress}
                                                        placeholder="Enter delivery address">
                                                    </textarea>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>
                                                        Payment Option
                                                    </label>
                                                    <div className="d-flex align-items-center gap-2 p-2"
                                                        style={{ background:'#fff', border:'1.5px solid #93c5fd', borderRadius:'.5rem' }}>
                                                        <i className="bi bi-cash-coin" style={{ color:'#0ea5e9', fontSize:'1.1rem' }}></i>
                                                        <span className="fw-semibold small" style={{ color:'#0f2942' }}>Cash on Delivery</span>
                                                        <span className="ms-auto badge" style={{ background:'#d1fae5', color:'#065f46' }}>Only option available</span>
                                                    </div>
                                                </div>

                                                <button type="submit" className="btn w-100 fw-bold text-white"
                                                    style={{ background:'linear-gradient(135deg,#10b981,#0ea5e9)', border:'none', borderRadius:'.6rem' }}
                                                    disabled={placingOrder}>
                                                    {
                                                        placingOrder ?
                                                            <span><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</span> :
                                                            <span><i className="bi bi-bag-check me-1"></i>Place Order (₹{payableEstimate.toFixed(2)})</span>
                                                    }
                                                </button>
                                            </form>

                                            <button className="btn w-100 fw-semibold mt-2"
                                                style={{ background:'transparent', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:'.6rem' }}
                                                onClick={() => navigate('/customer')}>
                                                <i className="bi bi-shop me-1"></i>Continue Shopping
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            <div className="text-center py-5" style={{ color:'#94a3b8' }}>
                                <i className="bi bi-cart-x" style={{ fontSize:'3rem', color:'#bfdbfe', display:'block', marginBottom:'1rem' }}></i>
                                <p>Your cart is empty.</p>
                                <button className="btn fw-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.6rem' }}
                                    onClick={() => navigate('/customer')}>
                                    Browse Products
                                </button>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyCart
