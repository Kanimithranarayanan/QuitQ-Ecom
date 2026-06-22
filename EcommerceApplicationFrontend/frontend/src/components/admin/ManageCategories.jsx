import axios from "axios"
import { useEffect, useState } from "react"

const ManageCategories = () => {
    const [categories, setCategories] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgCategoryName, setErrMsgCategoryName] = useState()
    const [deleteMsg, setDeleteMsg] = useState()

    const categoriesApi = "http://localhost:8088/api/category/all"
    const addCategoryApi = "http://localhost:8088/api/category/add"

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(categoriesApi)
            setCategories(response.data)
        }
        catch (err) { setErrMsg("Failed to load categories") }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const onAddCategory = async (e) => {
        e.preventDefault()
        let body = { 'categoryName': categoryName, 'description': '' }
        console.log(body)
        try {
            await axios.post(addCategoryApi, body, config_details)
            setSuccessMsg("Category Added Successfully")
            setCategoryName('')
            setErrMsg(undefined)
            setErrMsgCategoryName(undefined)
            fetchCategories()
        }
        catch (err) {
            console.log(JSON.stringify(err))
            setErrMsg("Failed to add category " + (err.response?.data?.message || ""))
            setErrMsgCategoryName(err.response?.data?.categoryName || undefined)
            setSuccessMsg(undefined)
        }
    }

    const onDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return
        try {
            await axios.delete("http://localhost:8088/api/category/delete/" + id, config_details)
            // update the categories array — soft delete from local state (no API refetch)
            let tempArry = [...categories].filter(c => c.id !== id)
            setCategories([...tempArry])
            setDeleteMsg("Category deleted from the system.")
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
                        <span><i className="bi bi-tags me-2"></i>Manage Categories</span>
                    </div>

                    {/* Add Category Form */}
                    <div className="card border-0 mb-4" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(29,78,216,0.08)' }}>
                        <div className="card-header" style={{ background:'#eff6ff', borderBottom:'1.5px solid #bfdbfe', borderRadius:'.75rem .75rem 0 0', color:'#1e40af', fontWeight:700, fontSize:'.9rem' }}>
                            Add New Category
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={(e) => onAddCategory(e)}>
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
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small" style={{ color:'#1e3a5f' }}>Category Name: </label>
                                    {
                                        errMsgCategoryName !== undefined ?
                                            <span style={{ color:'red', fontSize:'11px' }}>&nbsp;{errMsgCategoryName}</span> : ""
                                    }
                                    <input type="text" className="form-control" style={{ borderColor:'#bfdbfe', borderRadius:'.5rem' }}
                                        required onChange={(e) => setCategoryName(e.target.value)} value={categoryName} />
                                </div>
                                <button type="submit" className="btn fw-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#1d4ed8,#3b82f6)', border:'none', borderRadius:'.6rem', padding:'8px 24px' }}>
                                    <i className="bi bi-plus-circle me-1"></i>Add Category
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Categories List */}
                    {
                        deleteMsg !== undefined ?
                            <div className="quitq-toast mb-3">
                                <span><i className="bi bi-check-circle me-2"></i>{deleteMsg}</span>
                                <button type="button" className="btn-close btn-close-sm" onClick={() => setDeleteMsg(undefined)}></button>
                            </div> : ""
                    }

                    {
                        categories.length > 0 ?
                            <div className="card border-0" style={{ borderRadius:'.75rem', boxShadow:'0 2px 10px rgba(29,78,216,0.08)' }}>
                                <div className="card-header" style={{ background:'#eff6ff', borderBottom:'1.5px solid #bfdbfe', borderRadius:'.75rem .75rem 0 0', color:'#1e40af', fontWeight:700, fontSize:'.9rem' }}>
                                    All Categories
                                </div>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background:'#eff6ff' }}>
                                                {['ID','Category Name','Action'].map((h,i) => (
                                                    <th key={i} style={{ color:'#1e40af', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'.04em', borderBottom:'2px solid #bfdbfe' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                categories.map((c, index) => (
                                                    <tr key={index}>
                                                        <td style={{ color:'#64748b' }}>{c.id}</td>
                                                        <td className="fw-semibold" style={{ color:'#0f2942' }}>{c.categoryName}</td>
                                                        <td>
                                                            <button className="btn btn-link p-0 text-decoration-none"
                                                                style={{ color:'#ef4444' }}
                                                                onClick={() => onDelete(c.id)}>
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
                            <div className="text-center py-3" style={{ color:'#94a3b8' }}>
                                <p>No categories found. Add one above!</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageCategories
