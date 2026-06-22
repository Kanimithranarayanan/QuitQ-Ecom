import axios from "axios"
import { useEffect, useState } from "react"

const AddProduct = () => {
    const [productName, setProductName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [stockQuantity, setStockQuantity] = useState("")
    const [categoryId, setCategoryId] = useState(0)
    const [categories, setCategories] = useState([])

    // Multi-image upload state — trainer style: select many files, preview each, upload all together
    const [imageFiles, setImageFiles] = useState([])      // raw File objects selected
    const [imagePreviews, setImagePreviews] = useState([]) // blob URLs for preview
    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState()
    const [uploadedCount, setUploadedCount] = useState(0)

    const [newProductId, setNewProductId] = useState(null) // returned after product is added
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgProductName, setErrMsgProductName] = useState()
    const [errMsgPrice, setErrMsgPrice] = useState()
    const [errMsgStock, setErrMsgStock] = useState()

    const addProductApi = "http://localhost:8088/api/product/add"
    const uploadImagesApi = "http://localhost:8088/api/product/images/upload"
    const categoriesApi = "http://localhost:8088/api/category/all"

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(categoriesApi)
                setCategories(response.data)
            }
            catch (err) { }
        }
        getAllCategories()
    }, [])

    // Handle multiple file selection — append to existing selection, show previews
    const onFilesChange = (e) => {
        const selected = Array.from(e.target.files)
        if (selected.length === 0) return

        setImageFiles(prev => [...prev, ...selected])
        const newPreviews = selected.map(file => URL.createObjectURL(file))
        setImagePreviews(prev => [...prev, ...newPreviews])
        setUploadMsg(undefined)
    }

    // Remove one selected image before uploading (soft delete from local array)
    const onRemoveSelected = (index) => {
        setImageFiles(prev => [...prev].filter((_, i) => i !== index))
        setImagePreviews(prev => [...prev].filter((_, i) => i !== index))
    }

    // Step 1 — Add the product first, get back the new productId
    const onAddProduct = async (e) => {
        e.preventDefault()
        let body = {
            'productName': productName,
            'description': description,
            'price': parseFloat(price),
            'stockQuantity': parseInt(stockQuantity),
            'imageUrl': '',
            'categoryId': parseInt(categoryId)
        }
        console.log(body)
        try {
            const response = await axios.post(addProductApi, body, config_details)
            console.log(response.data)
            // Backend returns the created product's id so images can be linked to it
            setNewProductId(response.data.productId)
            setSuccessMsg("Product Added Successfully. Now upload images below.")
            setErrMsg(undefined)
            setErrMsgProductName(undefined)
            setErrMsgPrice(undefined)
            setErrMsgStock(undefined)
        }
        catch (err) {
            console.log(JSON.stringify(err))
            setErrMsg("Failed to add product " + (err.response?.data?.message || ""))
            setErrMsgProductName(err.response?.data?.productName || undefined)
            setErrMsgPrice(err.response?.data?.price || undefined)
            setErrMsgStock(err.response?.data?.stockQuantity || undefined)
            setSuccessMsg(undefined)
        }
    }

    // Step 2 — Upload all selected images together for the newly created product
    const onUploadImages = async () => {
        if (imageFiles.length === 0) {
            setUploadMsg("Please select at least one image")
            return
        }
        setUploading(true)
        setUploadMsg(undefined)

        // FormData with multiple files under the same key "files"
        const formData = new FormData()
        imageFiles.forEach(file => formData.append("files", file))

        try {
            await axios.post(uploadImagesApi + "/" + newProductId, formData, {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUploadedCount(imageFiles.length)
            setUploadMsg(imageFiles.length + " image(s) uploaded successfully!")
            // Clear selection after successful upload
            setImageFiles([])
            setImagePreviews([])
        }
        catch (err) {
            console.log(JSON.stringify(err))
            setUploadMsg("Upload failed: " + (err.response?.data?.message || "Error"))
        }
        finally {
            setUploading(false)
        }
    }

    // Reset the whole form to add another product
    const onAddAnother = () => {
        setProductName(''); setDescription(''); setPrice('')
        setStockQuantity(''); setCategoryId(0)
        setImageFiles([]); setImagePreviews([])
        setNewProductId(null)
        setSuccessMsg(undefined); setUploadMsg(undefined)
        setUploadedCount(0)
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-plus-circle me-2"></i>Add New Product</span>
                    </div>

                    <div className="card border-0"
                        style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(14,165,233,0.09)' }}>
                        <div className="card-header"
                            style={{ background: '#f0f9ff', borderBottom: '1.5px solid #a5f3fc', borderRadius: '.75rem .75rem 0 0', color: '#155e75', fontWeight: 700, fontSize: '.9rem' }}>
                            Step 1 — Product Details
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={(e) => onAddProduct(e)}>
                                {
                                    successMsg !== undefined ?
                                        <div className="alert border-0 mb-4"
                                            style={{ background: '#d1fae5', color: '#065f46', borderRadius: '.5rem' }}>
                                            <i className="bi bi-check-circle me-2"></i>{successMsg}
                                        </div> : ""
                                }
                                {
                                    errMsg !== undefined ?
                                        <div className="alert border-0 mb-4"
                                            style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>
                                            <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                        </div> : ""
                                }

                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                        Product Name:
                                    </label>
                                    {
                                        errMsgProductName !== undefined ?
                                            <span style={{ color: 'red', fontSize: '11px' }}>&nbsp;{errMsgProductName}</span> : ""
                                    }
                                    <input type="text" className="form-control"
                                        style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                        required disabled={newProductId !== null}
                                        onChange={(e) => setProductName(e.target.value)} value={productName} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                        Description:
                                    </label>
                                    <textarea className="form-control" rows="3"
                                        style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                        disabled={newProductId !== null}
                                        onChange={(e) => setDescription(e.target.value)} value={description}>
                                    </textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                                Price (₹):
                                            </label>
                                            {
                                                errMsgPrice !== undefined ?
                                                    <span style={{ color: 'red', fontSize: '11px' }}>&nbsp;{errMsgPrice}</span> : ""
                                            }
                                            <input type="number" className="form-control"
                                                style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                                required min="0" step="0.01" disabled={newProductId !== null}
                                                onChange={(e) => setPrice(e.target.value)} value={price} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                                Stock Quantity:
                                            </label>
                                            {
                                                errMsgStock !== undefined ?
                                                    <span style={{ color: 'red', fontSize: '11px' }}>&nbsp;{errMsgStock}</span> : ""
                                            }
                                            <input type="number" className="form-control"
                                                style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                                required min="0" disabled={newProductId !== null}
                                                onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>
                                        Category:
                                    </label>
                                    <select className="form-control"
                                        style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                        disabled={newProductId !== null}
                                        onChange={(e) => setCategoryId(e.target.value)} value={categoryId}>
                                        <option value={0}>---Select Category---</option>
                                        {
                                            categories.map((c, index) => (
                                                <option key={index} value={c.id}>{c.categoryName}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                {
                                    newProductId === null ?
                                        <button type="submit" className="btn fw-bold text-white"
                                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', border: 'none', borderRadius: '.6rem', padding: '8px 24px' }}>
                                            <i className="bi bi-plus-circle me-1"></i>Add Product
                                        </button> :
                                        <span className="badge"
                                            style={{ background: '#d1fae5', color: '#065f46', padding: '8px 16px', borderRadius: '.5rem', fontSize: '.85rem' }}>
                                            <i className="bi bi-check-circle me-1"></i>Product #{newProductId} created — upload images below
                                        </span>
                                }
                            </form>
                        </div>
                    </div>

                    {/* ---- Step 2: Multi-Image Upload Section — only shown after product is added ---- */}
                    {
                        newProductId !== null ?
                            <div className="card border-0 mt-4"
                                style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(14,165,233,0.09)' }}>
                                <div className="card-header"
                                    style={{ background: '#f0f9ff', borderBottom: '1.5px solid #a5f3fc', borderRadius: '.75rem .75rem 0 0', color: '#155e75', fontWeight: 700, fontSize: '.9rem' }}>
                                    Step 2 — Upload Product Images (multiple allowed)
                                </div>
                                <div className="card-body p-4">

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold mb-1" style={{ color: '#155e75' }}>
                                            Choose Image Files (you can select several at once)
                                        </label>
                                        <input type="file" className="form-control"
                                            style={{ borderColor: '#a5f3fc', borderRadius: '.5rem' }}
                                            accept="image/*" multiple
                                            onChange={(e) => onFilesChange(e)} />
                                    </div>

                                    {/* Preview Gallery of selected images, with remove buttons */}
                                    {
                                        imagePreviews.length > 0 ?
                                            <div className="row g-3 mb-3">
                                                {
                                                    imagePreviews.map((src, index) => (
                                                        <div className="col-3" key={index}>
                                                            <div className="position-relative"
                                                                style={{ height: '100px', background: '#fff', border: '1px solid #bfdbfe', borderRadius: '.5rem', overflow: 'hidden' }}>
                                                                <img src={src} alt={"preview-" + index}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                <button type="button"
                                                                    className="btn btn-sm position-absolute top-0 end-0"
                                                                    style={{ background: '#ef4444', color: '#fff', borderRadius: '0 0 0 .4rem', padding: '2px 8px', lineHeight: 1 }}
                                                                    onClick={() => onRemoveSelected(index)}>
                                                                    <i className="bi bi-x"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div> :
                                            <div className="text-center py-3 mb-3"
                                                style={{ background: '#f0f9ff', border: '2px dashed #a5f3fc', borderRadius: '.75rem' }}>
                                                <i className="bi bi-images" style={{ fontSize: '2rem', color: '#bfdbfe' }}></i>
                                                <p className="small mb-0" style={{ color: '#64748b' }}>No images selected yet</p>
                                            </div>
                                    }

                                    <div className="d-flex align-items-center gap-3">
                                        <button type="button"
                                            className="btn fw-bold"
                                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', color: '#fff', border: 'none', borderRadius: '.5rem', padding: '8px 20px' }}
                                            onClick={() => onUploadImages()}
                                            disabled={uploading || imageFiles.length === 0}>
                                            {
                                                uploading ?
                                                    <><span className="spinner-border spinner-border-sm me-1"></span>Uploading {imageFiles.length} image(s)...</> :
                                                    <><i className="bi bi-cloud-upload me-1"></i>Upload {imageFiles.length > 0 ? imageFiles.length : ''} Image(s)</>
                                            }
                                        </button>

                                        {
                                            uploadMsg !== undefined ?
                                                <span className="small fw-semibold"
                                                    style={{ color: uploadedCount > 0 ? '#065f46' : '#991b1b' }}>
                                                    {uploadedCount > 0 ? <i className="bi bi-check-circle me-1"></i> : <i className="bi bi-x-circle me-1"></i>}
                                                    {uploadMsg}
                                                </span> : ""
                                        }
                                    </div>

                                    {
                                        uploadedCount > 0 ?
                                            <button type="button" className="btn btn-sm fw-semibold mt-3"
                                                style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: '.5rem' }}
                                                onClick={() => onAddAnother()}>
                                                <i className="bi bi-plus-circle me-1"></i>Add Another Product
                                            </button> : ""
                                    }
                                </div>
                            </div> : ""
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
