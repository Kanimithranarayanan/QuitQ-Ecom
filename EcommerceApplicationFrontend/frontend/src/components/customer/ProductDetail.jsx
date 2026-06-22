import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProductReview from "./ProductReview"

// Delivery charge is 2% of the item total — kept in sync with the backend's
// DeliveryChargeUtility just for showing a live estimate as the customer
// types; the real, authoritative amount always comes back from the server.
const DELIVERY_CHARGE_PERCENT = 2

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [shippingAddress, setShippingAddress] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [selectedImage, setSelectedImage] = useState(null) // currently displayed large image
    const [placingOrder, setPlacingOrder] = useState(false)
    const [placedOrder, setPlacedOrder] = useState() // set after a successful Buy Now order
    const navigate = useNavigate()

    const productApi = "http://localhost:8088/api/product/get-one/" + id
    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(productApi)
                setProduct(response.data)
                // Default the gallery to the first available image: gallery image, then legacy imageUrl
                if (response.data.imagePaths && response.data.imagePaths.length > 0) {
                    setSelectedImage(response.data.imagePaths[0])
                } else {
                    setSelectedImage(response.data.imageUrl)
                }
            }
            catch (err) { setErrMsg("Product not found") }
        }
        getProduct()
    }, [])

    const addToCart = async () => {
        try {
            const body = { 'productId': parseInt(id), 'quantity': quantity }
            await axios.post("http://localhost:8088/api/cart/add", body, config_details)
            setSuccessMsg("Added to cart successfully!")
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Failed to add to cart: " + (err.response?.data?.message || "Error"))
            setSuccessMsg(undefined)
        }
    }

    // Live estimate shown to the customer before they submit — the
    // confirmed figures always come from the server response after placing.
    const itemTotalEstimate = product ? product.price * quantity : 0
    const deliveryChargeEstimate = Math.round(itemTotalEstimate * DELIVERY_CHARGE_PERCENT) / 100
    const grandTotalEstimate = itemTotalEstimate + deliveryChargeEstimate

    const placeOrder = async (e) => {
        e.preventDefault()
        if (!shippingAddress.trim()) {
            setErrMsg("Please enter a shipping address")
            return
        }
        setPlacingOrder(true)
        try {
            const body = { 'productId': parseInt(id), 'quantity': quantity, 'shippingAddress': shippingAddress }
            const response = await axios.post("http://localhost:8088/api/order/place", body, config_details)
            setPlacedOrder(response.data)
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Order failed: " + (err.response?.data?.message || "Error"))
        }
        finally {
            setPlacingOrder(false)
        }
    }

    // ---- Center-of-page order confirmation, shown after a successful Buy Now order ----
    if (placedOrder) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
                <div className="card border-0 text-center p-4" style={{ maxWidth: '460px', width: '100%', borderRadius: '1rem', boxShadow: '0 8px 30px rgba(29,78,216,0.12)' }}>
                    <i className="bi bi-bag-check-fill" style={{ fontSize: '3.5rem', color: '#10b981' }}></i>
                    <h4 className="fw-bold mt-3 mb-1" style={{ color: '#0f2942' }}>Order Placed Successfully!</h4>
                    <p className="text-muted small mb-4">Pay with cash when your order is delivered.</p>

                    <div className="card border-0 p-3 mb-4 text-start" style={{ background: '#eff6ff', borderRadius: '.75rem', border: '1.5px solid #bfdbfe' }}>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="small" style={{ color: '#1e3a5f' }}>Order ID</span>
                            <span className="fw-semibold" style={{ color: '#1d4ed8' }}>#{placedOrder.orderId}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                            <span className="small" style={{ color: '#1e3a5f' }}>Product</span>
                            <span className="fw-semibold" style={{ color: '#0f2942' }}>{placedOrder.productName}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small" style={{ color: '#1e3a5f' }}>Quantity</span>
                            <span className="fw-semibold" style={{ color: '#0f2942' }}>{placedOrder.quantity}</span>
                        </div>
                        <hr style={{ borderColor: '#bfdbfe', margin: '.25rem 0 .6rem' }} />
                        <div className="d-flex justify-content-between mb-1">
                            <span className="small" style={{ color: '#1e3a5f' }}>Item Total</span>
                            <span style={{ color: '#0f2942' }}>₹{placedOrder.totalAmount}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small" style={{ color: '#1e3a5f' }}>Delivery Charge</span>
                            <span style={{ color: '#0f2942' }}>₹{placedOrder.deliveryCharge}</span>
                        </div>
                        <hr style={{ borderColor: '#bfdbfe', margin: '.25rem 0 .6rem' }} />
                        <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold" style={{ color: '#1e3a5f' }}>Amount to Pay</span>
                            <span className="fw-black fs-5" style={{ color: '#1d4ed8' }}>₹{placedOrder.grandTotal}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="small fw-semibold" style={{ color: '#1e3a5f' }}>Payment Method</span>
                            <span className="fw-bold small" style={{ color: '#0f2942' }}>Cash on Delivery</span>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
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

                    <button className="btn btn-sm fw-semibold mb-4"
                        style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '.5rem' }}
                        onClick={() => navigate('/customer')}>
                        <i className="bi bi-arrow-left me-1"></i>Back to Products
                    </button>

                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3"
                                style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>
                                {errMsg}
                            </div> : ""
                    }
                    {
                        successMsg !== undefined ?
                            <div className="alert border-0 mb-3"
                                style={{ background: '#d1fae5', color: '#065f46', borderRadius: '.5rem' }}>
                                {successMsg}
                            </div> : ""
                    }

                    {
                        product !== null ?
                            <div>
                                {/* Product Info */}
                                <div className="row g-4">
                                    <div className="col-md-5">
                                        {/* Large selected image */}
                                        <div className="d-flex align-items-center justify-content-center"
                                            style={{ height: '300px', background: '#fff', borderRadius: '.75rem', border: '1.5px solid #bfdbfe', overflow: 'hidden', padding: '12px' }}>
                                            {
                                                selectedImage ?
                                                    <img src={selectedImage} alt={product.productName}
                                                        className="img-fluid w-100 h-100" style={{ objectFit: 'contain' }} /> :
                                                    <i className="bi bi-image" style={{ fontSize: '5rem', color: '#bfdbfe' }}></i>
                                            }
                                        </div>

                                        {/* Thumbnail strip — only shown when there are multiple uploaded images */}
                                        {
                                            product.imagePaths && product.imagePaths.length > 0 ?
                                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                                    {
                                                        product.imagePaths.map((img, index) => (
                                                            <div key={index}
                                                                onClick={() => setSelectedImage(img)}
                                                                style={{
                                                                    width: '60px', height: '60px', borderRadius: '.4rem',
                                                                    overflow: 'hidden', cursor: 'pointer',
                                                                    border: selectedImage === img ? '2px solid #3b82f6' : '1px solid #bfdbfe',
                                                                    opacity: selectedImage === img ? 1 : 0.75
                                                                }}>
                                                                <img src={img} alt={"thumb-" + index}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                        ))
                                                    }
                                                </div> : ""
                                        }
                                    </div>
                                    <div className="col-md-7">
                                        <h3 className="fw-bold mb-1" style={{ color: '#0f2942' }}>{product.productName}</h3>
                                        <p className="small mb-1" style={{ color: '#64748b' }}>
                                            Category: <strong>{product.categoryName}</strong>
                                        </p>
                                        <p className="small mb-2" style={{ color: '#64748b' }}>
                                            Seller: <strong>{product.sellerName}</strong>
                                        </p>
                                        <p className="small mb-3" style={{ color: '#64748b' }}>{product.description}</p>

                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <span className="fw-black" style={{ fontSize: '1.8rem', color: '#1d4ed8' }}>
                                                ₹{product.price}
                                            </span>
                                            {
                                                product.stockQuantity > 0 ?
                                                    <span style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: '.4rem', padding: '3px 10px', fontSize: '.78rem', fontWeight: 700 }}>
                                                        In Stock ({product.stockQuantity})
                                                    </span> :
                                                    <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '.4rem', padding: '3px 10px', fontSize: '.78rem', fontWeight: 700 }}>
                                                        Out of Stock
                                                    </span>
                                            }
                                        </div>

                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <label className="fw-semibold small" style={{ color: '#1e3a5f' }}>Quantity:</label>
                                            <input type="number"
                                                className="form-control form-control-sm"
                                                style={{ width: '80px', borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                                min="1" max={product.stockQuantity} value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
                                        </div>

                                        <button className="btn fw-bold text-white me-2"
                                            style={{ background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', border: 'none', borderRadius: '.6rem', padding: '8px 20px' }}
                                            onClick={() => addToCart()}
                                            disabled={product.stockQuantity === 0}>
                                            <i className="bi bi-cart-plus me-1"></i>Add to Cart
                                        </button>

                                        <hr style={{ borderColor: '#bfdbfe', margin: '1.25rem 0' }} />

                                        <h6 className="fw-bold mb-3" style={{ color: '#0f2942' }}>
                                            Buy Now — Place Direct Order
                                        </h6>

                                        {/* Price breakdown — item total, delivery charge, grand total */}
                                        <div className="card border-0 p-3 mb-3" style={{ background: '#eff6ff', borderRadius: '.6rem', border: '1.5px solid #bfdbfe', maxWidth: '320px' }}>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="small" style={{ color: '#1e3a5f' }}>Item Total ({quantity} × ₹{product.price})</span>
                                                <span className="small fw-semibold" style={{ color: '#0f2942' }}>₹{itemTotalEstimate.toFixed(2)}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="small" style={{ color: '#1e3a5f' }}>Delivery Charge ({DELIVERY_CHARGE_PERCENT}%)</span>
                                                <span className="small fw-semibold" style={{ color: '#0f2942' }}>₹{deliveryChargeEstimate.toFixed(2)}</span>
                                            </div>
                                            <hr style={{ borderColor: '#bfdbfe', margin: '.25rem 0 .5rem' }} />
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold small" style={{ color: '#1e3a5f' }}>Total Payable</span>
                                                <span className="fw-black" style={{ color: '#1d4ed8' }}>₹{grandTotalEstimate.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <form onSubmit={(e) => placeOrder(e)}>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                                    Shipping Address
                                                </label>
                                                <textarea className="form-control" rows="2"
                                                    style={{ borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                                    required
                                                    onChange={(e) => setShippingAddress(e.target.value)}
                                                    value={shippingAddress}
                                                    placeholder="Enter delivery address">
                                                </textarea>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                                    Payment Option
                                                </label>
                                                <div className="d-flex align-items-center gap-2 p-2"
                                                    style={{ background: '#fff', border: '1.5px solid #93c5fd', borderRadius: '.5rem', maxWidth: '320px' }}>
                                                    <i className="bi bi-cash-coin" style={{ color: '#0ea5e9', fontSize: '1.1rem' }}></i>
                                                    <span className="fw-semibold small" style={{ color: '#0f2942' }}>Cash on Delivery</span>
                                                    <span className="ms-auto badge" style={{ background: '#d1fae5', color: '#065f46' }}>Only option available</span>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn fw-bold text-white"
                                                style={{ background: 'linear-gradient(135deg,#10b981,#0ea5e9)', border: 'none', borderRadius: '.6rem', padding: '8px 24px' }}
                                                disabled={product.stockQuantity === 0 || placingOrder}>
                                                {
                                                    placingOrder ?
                                                        <span><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</span> :
                                                        <span><i className="bi bi-bag-check me-1"></i>Place Order (₹{grandTotalEstimate.toFixed(2)})</span>
                                                }
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* ---- Reviews Section — embedded below product ---- */}
                                <hr style={{ borderColor: '#bfdbfe', margin: '2rem 0 1rem' }} />
                                <ProductReview productId={id} />

                            </div> :
                            <div className="text-center py-5" style={{ color: '#94a3b8' }}>
                                <div className="spinner-border" style={{ color: '#3b82f6' }} role="status"></div>
                                <p className="mt-2">Loading product...</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
