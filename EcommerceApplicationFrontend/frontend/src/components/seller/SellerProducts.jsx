import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getBySeller, softDeleteProduct } from "../../store/action/productAction"

const SellerProducts = () => {
    /*
        state = {
            products: []
        }
    */
    const { products } = useSelector(state => state.products)
    const dispatch = useDispatch()

    const [deleteMsg, setDeleteMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const navigate = useNavigate()

    const username = localStorage.getItem('username')
    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        dispatch(getBySeller(username)) // Dispatch an action
    }, [])

    const onDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return
        try {
            // call api to delete
            await axios.delete("http://localhost:8088/api/product/delete/" + productId, config_details)
            // update the products array — soft delete from local state (no API refetch)
            dispatch(softDeleteProduct(productId))
            setDeleteMsg("Product deleted from the system.")
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
                        <span><i className="bi bi-box-seam me-2"></i>My Products</span>
                        <button className="btn btn-sm fw-bold text-white"
                            style={{ background:'linear-gradient(135deg,#0ea5e9,#06b6d4)', border:'none', borderRadius:'.5rem' }}
                            onClick={() => navigate('/seller/add-product')}>
                            <i className="bi bi-plus-circle me-1"></i>Add Product
                        </button>
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
                        products.length > 0 ?
                            <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(59,130,246,0.07)' }}>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background:'#f0f9ff' }}>
                                                {['ID','Image','Product Name','Category','Price','Stock','Actions'].map((h,i) => (
                                                    <th key={i} style={{ color:'#155e75', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #a5f3fc' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                products.map((p, index) => (
                                                    <tr key={index}>
                                                        <td style={{ color:'#64748b' }}>{p.productId}</td>
                                                        <td>
                                                            <div className="position-relative d-inline-block"
                                                                style={{ width:'48px', height:'48px', borderRadius:'.4rem', overflow:'hidden', background:'#f0f9ff', border:'1px solid #a5f3fc' }}>
                                                                {
                                                                    (p.imagePaths && p.imagePaths.length > 0) || p.imageUrl ?
                                                                        <img src={(p.imagePaths && p.imagePaths.length > 0) ? p.imagePaths[0] : p.imageUrl}
                                                                            alt={p.productName}
                                                                            style={{ width:'100%', height:'100%', objectFit:'cover' }} /> :
                                                                        <i className="bi bi-image" style={{ fontSize:'1.3rem', color:'#a5f3fc', display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}></i>
                                                                }
                                                                {
                                                                    p.imagePaths && p.imagePaths.length > 1 ?
                                                                        <span className="position-absolute bottom-0 end-0"
                                                                            style={{ background:'rgba(15,41,66,0.75)', color:'#fff', fontSize:'.6rem', padding:'0 3px', borderRadius:'2px 0 0 0' }}>
                                                                            {p.imagePaths.length}
                                                                        </span> : ""
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="fw-semibold" style={{ color:'#0f2942' }}>{p.productName}</td>
                                                        <td style={{ color:'#64748b' }}>{p.categoryName}</td>
                                                        <td className="fw-bold" style={{ color:'#0ea5e9' }}>₹{p.price}</td>
                                                        <td>
                                                            {
                                                                p.stockQuantity > 0 ?
                                                                    <span style={{ background:'#cffafe', color:'#155e75', border:'1px solid #a5f3fc', borderRadius:'.4rem', padding:'2px 8px', fontSize:'.78rem', fontWeight:700 }}>
                                                                        {p.stockQuantity}
                                                                    </span> :
                                                                    <span style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5', borderRadius:'.4rem', padding:'2px 8px', fontSize:'.78rem', fontWeight:700 }}>
                                                                        Out of Stock
                                                                    </span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-link p-0 text-decoration-none"
                                                                style={{ color:'#ef4444' }}
                                                                onClick={() => onDelete(p.productId)}>
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
                                <i className="bi bi-box" style={{ fontSize:'3rem', color:'#a5f3fc', display:'block', marginBottom:'1rem' }}></i>
                                <p>No products listed yet.</p>
                                <button className="btn fw-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#0ea5e9,#06b6d4)', border:'none', borderRadius:'.6rem' }}
                                    onClick={() => navigate('/seller/add-product')}>
                                    Add Your First Product
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

export default SellerProducts
