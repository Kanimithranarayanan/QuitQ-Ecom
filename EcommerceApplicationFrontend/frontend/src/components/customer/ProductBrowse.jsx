import axios from "axios"
import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getAllPaginated, searchByKeyword, filterByCategory, filterByPriceRange } from "../../store/action/productAction"

const ProductBrowse = () => {

    /*
        state = {
            products: [],
            totalPages: 0,
            totalElements: 0
        }
    */
    const { products, totalPages } = useSelector(state => state.products)
    const dispatch = useDispatch()

    const [categories, setCategories] = useState([])
    const [keyword, setKeyword] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [size] = useState(6)
    const [arry, setArry] = useState([])
    const [sortOption, setSortOption] = useState("")
    const [deleteMsg, setDeleteMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const categoriesApi = "http://localhost:8088/api/category/all"
    const navigate = useNavigate()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        // Fetch categories for filter dropdown
        const fetchCategories = async () => {
            try {
                const response = await axios.get(categoriesApi)
                setCategories(response.data)
            }
            catch (err) { }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        dispatch(getAllPaginated(currentPage, size)) // Dispatch an action
    }, [currentPage]) // Dep array — re-fetch whenever page changes

    useEffect(() => {
        // Build page number array from totalPages (trainer exact style)
        setArry(Array.from({ length: totalPages }))
    }, [totalPages])

    const onSearch = (e) => {
        e.preventDefault()
        dispatch(searchByKeyword(keyword))
    }

    const onFilterByCategory = (catId) => {
        setSelectedCategory(catId)
        if (catId === "") {
            dispatch(getAllPaginated(0, size))
            return
        }
        dispatch(filterByCategory(catId))
    }

    const onFilterByPrice = (e) => {
        e.preventDefault()
        if (!minPrice || !maxPrice) return
        dispatch(filterByPriceRange(minPrice, maxPrice))
    }

    // Sort whatever products are currently loaded (default list, search result,
    // category filter, or price-range filter) — purely a display-level transform,
    // so existing filters keep working and nothing is refetched on sort change.
    const sortedProducts = useMemo(() => {
        if (!sortOption) return products
        const list = [...products]
        switch (sortOption) {
            case "price_low_high":
                return list.sort((a, b) => a.price - b.price)
            case "price_high_low":
                return list.sort((a, b) => b.price - a.price)
            case "newest":
                return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            case "oldest":
                return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            default:
                return list
        }
    }, [products, sortOption])

    const addToCart = async (productId) => {
        try {
            const body = { 'productId': productId, 'quantity': 1 }
            await axios.post("http://localhost:8088/api/cart/add", body, config_details)
            setDeleteMsg("Product added to cart!")
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Failed to add to cart: " + (err.response?.data?.message || "Error"))
            setDeleteMsg(undefined)
        }
    }

    let count = 0

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">

                    {/* Search and Filter Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <form onSubmit={(e) => onSearch(e)} className="d-flex gap-2">
                                <input type="text" className="form-control"
                                    style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                    placeholder="Search products..."
                                    onChange={(e) => setKeyword(e.target.value)} value={keyword} />
                                <button className="btn fw-bold text-white" type="submit"
                                    style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.5rem' }}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                onChange={(e) => onFilterByCategory(e.target.value)} value={selectedCategory}>
                                <option value="">All Categories</option>
                                {
                                    categories.map((c, index) => (
                                        <option key={index} value={c.id}>{c.categoryName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                                <option value="">Sort By</option>
                                <option value="price_low_high">Price: Low to High</option>
                                <option value="price_high_low">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <form onSubmit={(e) => onFilterByPrice(e)} className="d-flex gap-2 align-items-center">
                                <input type="number" className="form-control" placeholder="Min ₹"
                                    style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                    onChange={(e) => setMinPrice(e.target.value)} value={minPrice} />
                                <span style={{ color:'#94a3b8' }}>−</span>
                                <input type="number" className="form-control" placeholder="Max ₹"
                                    style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                    onChange={(e) => setMaxPrice(e.target.value)} value={maxPrice} />
                                <button className="btn fw-semibold" type="submit"
                                    style={{ background:'#eff6ff', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:'.5rem', whiteSpace:'nowrap' }}>
                                    Filter
                                </button>
                            </form>
                        </div>
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
                            <div className="alert border-0 mb-3"
                                style={{ background:'#fee2e2', color:'#991b1b', borderRadius:'.5rem' }}>
                                {errMsg}
                            </div> : ""
                    }

                    {/* Products Grid */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                        {
                            sortedProducts.map((p, index) => (
                                <div className="col" key={index}>
                                    <div className="product-card card h-100">
                                        <div className="product-img d-flex align-items-center justify-content-center position-relative">
                                            {
                                                (p.imagePaths && p.imagePaths.length > 0) || p.imageUrl ?
                                                    <img src={(p.imagePaths && p.imagePaths.length > 0) ? p.imagePaths[0] : p.imageUrl}
                                                        alt={p.productName}
                                                        className="img-fluid w-100 h-100" style={{ objectFit:'contain' }} /> :
                                                    <i className="bi bi-image fs-1" style={{ color:'#bfdbfe' }}></i>
                                            }
                                            {
                                                p.imagePaths && p.imagePaths.length > 1 ?
                                                    <span className="position-absolute bottom-0 end-0 m-2 badge"
                                                        style={{ background:'rgba(15,41,66,0.75)', color:'#fff', fontSize:'.7rem' }}>
                                                        <i className="bi bi-images me-1"></i>{p.imagePaths.length}
                                                    </span> : ""
                                            }
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h6 className="fw-bold mb-1" style={{ color:'#0f2942' }}>{p.productName}</h6>
                                            <p className="small mb-1" style={{ color:'#64748b' }}>{p.categoryName}</p>
                                            <p className="small mb-2" style={{ color:'#94a3b8' }}>Seller: {p.sellerName}</p>
                                            <div className="d-flex align-items-center justify-content-between mt-auto">
                                                <span className="fw-black" style={{ color:'#1d4ed8', fontSize:'1.1rem' }}>₹{p.price}</span>
                                                {
                                                    p.stockQuantity > 0 ?
                                                        <span style={{ background:'#d1fae5', color:'#065f46', border:'1px solid #6ee7b7', borderRadius:'.4rem', padding:'2px 8px', fontSize:'.75rem', fontWeight:700 }}>
                                                            In Stock ({p.stockQuantity})
                                                        </span> :
                                                        <span style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5', borderRadius:'.4rem', padding:'2px 8px', fontSize:'.75rem', fontWeight:700 }}>
                                                            Out of Stock
                                                        </span>
                                                }
                                            </div>
                                        </div>
                                        <div className="card-footer d-flex gap-2 border-0" style={{ background:'#f8faff', borderTop:'1px solid #bfdbfe', borderRadius:'0 0 .75rem .75rem' }}>
                                            <button className="btn btn-sm fw-semibold flex-grow-1"
                                                style={{ background:'#eff6ff', color:'#1e40af', border:'1px solid #bfdbfe', borderRadius:'.5rem' }}
                                                onClick={() => navigate('/customer/product/' + p.productId)}>
                                                <i className="bi bi-eye me-1"></i>View
                                            </button>
                                            <button className="btn btn-sm fw-semibold flex-grow-1 text-white"
                                                style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', border:'none', borderRadius:'.5rem' }}
                                                onClick={() => addToCart(p.productId)}
                                                disabled={p.stockQuantity === 0}>
                                                <i className="bi bi-cart-plus me-1"></i>Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            sortedProducts.length === 0 ?
                                <div className="col-12 text-center py-5" style={{ color:'#94a3b8' }}>
                                    <i className="bi bi-search" style={{ fontSize:'3rem', color:'#bfdbfe', display:'block', marginBottom:'1rem' }}></i>
                                    No products found.
                                </div> : ""
                        }
                    </div>

                    {/* Pagination — trainer exact style */}
                    <nav aria-label="Product pagination" className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === 0}
                                    onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>
                            {
                                arry.map((_, index) => (
                                    <li className="page-item" key={index}>
                                        <button className={`page-link ${currentPage === index ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(index)}>{count = count + 1}
                                        </button>
                                    </li>
                                ))
                            }
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === (totalPages - 1)}
                                    onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductBrowse
