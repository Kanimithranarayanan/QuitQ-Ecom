import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyReviews, softDeleteReview } from "../../store/action/reviewAction"

const MyReviews = () => {

    /*
        state = {
            reviews: []
        }
    */
    const { reviews } = useSelector(state => state.reviews)
    const dispatch = useDispatch()

    const [deleteMsg, setDeleteMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    useEffect(() => {
        dispatch(getMyReviews()) // Dispatch an action
    }, [])

    const onDelete = async (reviewId) => {
        try {
            // call api to delete
            await axios.delete("http://localhost:8088/api/review/delete/" + reviewId, config_details)
            // update the reviews array — soft delete from local state (no API refetch)
            dispatch(softDeleteReview(reviewId))
            setDeleteMsg("Review deleted from the system.")
            setErrMsg(undefined)
        }
        catch (err) {
            setErrMsg("Delete failed: " + (err.response?.data?.message || "Error"))
            setDeleteMsg(undefined)
        }
    }

    // Helper — render filled/empty stars
    const renderStars = (count) => {
        return [1, 2, 3, 4, 5].map(i => (
            <i key={i}
                className={i <= count ? "bi bi-star-fill" : "bi bi-star"}
                style={{ color: i <= count ? '#f59e0b' : '#cbd5e1', fontSize: '.85rem' }}>
            </i>
        ))
    }

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">

                    <div className="section-header">
                        <span><i className="bi bi-star me-2"></i>My Reviews</span>
                    </div>

                    {
                        deleteMsg !== undefined ?
                            <div className="quitq-toast mb-3">
                                <span><i className="bi bi-check-circle me-2"></i>{deleteMsg}</span>
                                <button type="button" className="btn-close btn-close-sm"
                                    onClick={() => setDeleteMsg(undefined)}></button>
                            </div> : ""
                    }
                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3"
                                style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>
                                {errMsg}
                            </div> : ""
                    }

                    {
                        reviews.length > 0 ?
                            <div className="card border-0"
                                style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)' }}>
                                <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr style={{ background: '#eff6ff' }}>
                                                {['Product', 'Rating', 'Comment', 'Date', 'Action'].map((h, i) => (
                                                    <th key={i} style={{ color: '#1e40af', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                reviews.map((r, index) => (
                                                    <tr key={index}>
                                                        <td className="fw-semibold" style={{ color: '#0f2942' }}>{r.productName}</td>
                                                        <td>
                                                            <div className="d-flex gap-1 align-items-center">
                                                                {renderStars(r.rating)}
                                                                <span className="ms-1 small fw-bold" style={{ color: '#f59e0b' }}>{r.rating}/5</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted small">{r.comment || '—'}</td>
                                                        <td className="text-muted small">
                                                            {new Date(r.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-link p-0 text-decoration-none"
                                                                style={{ color: '#ef4444' }}
                                                                onClick={() => onDelete(r.reviewId)}>
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
                            <div className="text-center py-5" style={{ color: '#94a3b8' }}>
                                <i className="bi bi-star"
                                    style={{ fontSize: '3rem', color: '#bfdbfe', display: 'block', marginBottom: '1rem' }}></i>
                                <p>You haven't written any reviews yet.</p>
                            </div>
                    }

                    <div className="text-end mt-3">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyReviews
