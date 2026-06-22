import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getReviewsByProduct, softDeleteReview } from "../../store/action/reviewAction"

const ProductReview = ({ productId }) => {

    /*
        state = {
            reviews: []
        }
    */
    const { reviews } = useSelector(state => state.reviews)
    const dispatch = useDispatch()

    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [hoverRating, setHoverRating] = useState(0)
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [deleteMsg, setDeleteMsg] = useState()

    const addReviewApi = "http://localhost:8088/api/review/add"
    const deleteReviewApi = "http://localhost:8088/api/review/delete"

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const username = localStorage.getItem('username')

    useEffect(() => {
        dispatch(getReviewsByProduct(productId)) // Dispatch an action
    }, [productId])

    const onAddReview = async (e) => {
        e.preventDefault()
        let body = {
            'productId': parseInt(productId),
            'rating': parseInt(rating),
            'comment': comment
        }
        console.log(body)
        try {
            const response = await axios.post(addReviewApi, body, config_details)
            setSuccessMsg("Review Added Successfully")
            setComment('')
            setRating(5)
            setErrMsg(undefined)
            // Refresh reviews from backend
            dispatch(getReviewsByProduct(productId))
        }
        catch (err) {
            console.log(JSON.stringify(err))
            setErrMsg("Failed to add review: " + (err.response?.data?.message || "Error"))
            setSuccessMsg(undefined)
        }
    }

    const onDelete = async (reviewId) => {
        try {
            // call api to delete
            await axios.delete(deleteReviewApi + "/" + reviewId, config_details)
            // update the reviews array — soft delete from local state (no API refetch)
            dispatch(softDeleteReview(reviewId))
            setDeleteMsg("Review deleted.")
        }
        catch (err) {
            setErrMsg("Delete failed: " + (err.response?.data?.message || "Error"))
        }
    }

    // Helper — render filled/empty stars
    const renderStars = (count) => {
        return [1, 2, 3, 4, 5].map(i => (
            <i key={i}
                className={i <= count ? "bi bi-star-fill" : "bi bi-star"}
                style={{ color: i <= count ? '#f59e0b' : '#cbd5e1', fontSize: '.9rem' }}>
            </i>
        ))
    }

    // Average rating calculation
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null

    return (
        <div className="mt-4">

            {/* Overall Rating Summary */}
            {
                reviews.length > 0 ?
                    <div className="d-flex align-items-center gap-3 mb-4 p-3"
                        style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '.75rem' }}>
                        <div className="text-center">
                            <div className="fw-black" style={{ fontSize: '2.5rem', color: '#f59e0b', lineHeight: 1 }}>{avgRating}</div>
                            <div style={{ fontSize: '.75rem', color: '#92400e' }}>out of 5</div>
                        </div>
                        <div>
                            <div className="d-flex gap-1 mb-1">
                                {renderStars(Math.round(avgRating))}
                            </div>
                            <div style={{ color: '#92400e', fontSize: '.82rem', fontWeight: 600 }}>
                                Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}
                            </div>
                        </div>
                    </div> : ""
            }

            {/* Add Review Form */}
            <div className="card border-0 mb-4"
                style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)', border: '1.5px solid #bfdbfe' }}>
                <div className="card-header"
                    style={{ background: '#eff6ff', borderBottom: '1.5px solid #bfdbfe', borderRadius: '.75rem .75rem 0 0', color: '#1e40af', fontWeight: 700, fontSize: '.9rem' }}>
                    <i className="bi bi-star me-2"></i>Write a Review
                </div>
                <div className="card-body p-4">
                    <form onSubmit={(e) => onAddReview(e)}>
                        {
                            successMsg !== undefined ?
                                <div className="alert border-0 mb-3"
                                    style={{ background: '#d1fae5', color: '#065f46', borderRadius: '.5rem' }}>
                                    <i className="bi bi-check-circle me-2"></i>{successMsg}
                                </div> : ""
                        }
                        {
                            errMsg !== undefined ?
                                <div className="alert border-0 mb-3"
                                    style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>
                                    <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                                </div> : ""
                        }

                        {/* Star Rating Picker */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>Your Rating: </label>
                            <div className="d-flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i key={star}
                                        className={(hoverRating || rating) >= star ? "bi bi-star-fill" : "bi bi-star"}
                                        style={{
                                            fontSize: '1.6rem',
                                            color: (hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1',
                                            cursor: 'pointer',
                                            transition: 'color .15s'
                                        }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}>
                                    </i>
                                ))}
                                <span className="ms-2 fw-bold small align-self-center" style={{ color: '#f59e0b' }}>
                                    {rating}/5
                                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small" style={{ color: '#1e3a5f' }}>Comment: </label>
                            <textarea className="form-control" rows="3"
                                style={{ borderColor: '#bfdbfe', borderRadius: '.5rem' }}
                                placeholder="Share your experience with this product..."
                                onChange={(e) => setComment(e.target.value)} value={comment}></textarea>
                        </div>

                        <button type="submit" className="btn fw-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', border: 'none', borderRadius: '.6rem', padding: '8px 24px' }}>
                            <i className="bi bi-send me-1"></i>Submit Review
                        </button>
                    </form>
                </div>
            </div>

            {/* Reviews List */}
            <h6 className="fw-bold mb-3" style={{ color: '#0f2942' }}>
                <i className="bi bi-chat-left-text me-2"></i>
                Customer Reviews ({reviews.length})
            </h6>

            {
                deleteMsg !== undefined ?
                    <div className="quitq-toast mb-3">
                        <span><i className="bi bi-check-circle me-2"></i>{deleteMsg}</span>
                        <button type="button" className="btn-close btn-close-sm" onClick={() => setDeleteMsg(undefined)}></button>
                    </div> : ""
            }

            {
                reviews.length > 0 ?
                    reviews.map((r, index) => (
                        <div key={index} className="card border-0 mb-3"
                            style={{ borderRadius: '.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(59,130,246,0.06)' }}>
                            <div className="card-body p-3">
                                <div className="d-flex align-items-start justify-content-between">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        {/* Customer avatar initials */}
                                        <div className="d-flex align-items-center justify-content-center fw-bold text-white"
                                            style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#0ea5e9)', fontSize: '.85rem', flexShrink: 0 }}>
                                            {r.customerName ? r.customerName.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                        <div>
                                            <div className="fw-bold" style={{ color: '#0f2942', fontSize: '.88rem' }}>{r.customerName}</div>
                                            <div className="d-flex gap-1">
                                                {renderStars(r.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span style={{ color: '#94a3b8', fontSize: '.78rem' }}>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                        {/* Show delete button only for reviewer's own review */}
                                        {
                                            r.customerName === username ?
                                                <button className="btn btn-link p-0 text-decoration-none"
                                                    style={{ color: '#ef4444' }}
                                                    onClick={() => onDelete(r.reviewId)}>
                                                    <i className="bi bi-trash"></i>
                                                </button> : ""
                                        }
                                    </div>
                                </div>
                                {
                                    r.comment ?
                                        <p className="mb-0 mt-1" style={{ color: '#475569', fontSize: '.88rem', lineHeight: 1.6 }}>
                                            {r.comment}
                                        </p> : ""
                                }
                            </div>
                        </div>
                    )) :
                    <div className="text-center py-4" style={{ color: '#94a3b8' }}>
                        <i className="bi bi-chat-square" style={{ fontSize: '2.5rem', color: '#bfdbfe', display: 'block', marginBottom: '.75rem' }}></i>
                        <p className="small">No reviews yet. Be the first to review!</p>
                    </div>
            }

            <div className="text-end mt-3">
            </div>
        </div>
    )
}

export default ProductReview
