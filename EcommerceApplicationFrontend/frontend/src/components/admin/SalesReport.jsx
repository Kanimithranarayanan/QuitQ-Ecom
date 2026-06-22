import axios from "axios"
import { useEffect, useRef, useState } from "react"
import {
    Chart as ChartJS,
    BarElement,
    BarController,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
} from "chart.js"

// Register only what we use, to keep the bundle lean.
ChartJS.register(BarElement, BarController, LinearScale, CategoryScale, Tooltip, Legend)

const SalesReport = () => {
    const [report, setReport] = useState(null)
    const [errMsg, setErrMsg] = useState()
    const [loading, setLoading] = useState(true)

    const chartRef = useRef(null)       // <canvas> element
    const chartInstanceRef = useRef(null) // the live Chart.js instance, so we can destroy it on re-render

    const config_details = {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('token') }
    }

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get("http://localhost:8088/api/admin/reports/sales", config_details)
                setReport(response.data)
                setErrMsg(undefined)
            }
            catch (err) {
                setErrMsg("Failed to load sales report: " + (err.response?.data?.message || "Error"))
            }
            finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [])

    // Draw / redraw the monthly revenue bar chart whenever the report data changes.
    useEffect(() => {
        if (!report || !chartRef.current) return

        // Chart.js wants oldest-to-newest order for a left-to-right timeline.
        const monthsAscending = [...report.monthlyRevenue].reverse()

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy()
        }

        chartInstanceRef.current = new ChartJS(chartRef.current, {
            type: 'bar',
            data: {
                labels: monthsAscending.map(m => m.monthLabel),
                datasets: [{
                    label: 'Revenue (₹)',
                    data: monthsAscending.map(m => m.revenue),
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    maxBarThickness: 48
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => '₹' + ctx.parsed.y.toLocaleString('en-IN')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: (value) => '₹' + value.toLocaleString('en-IN') }
                    }
                }
            }
        })

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy()
                chartInstanceRef.current = null
            }
        }
    }, [report])

    return (
        <div>
            <div className="quitq-widget">
                <div className="quitq-widget-inner">
                    <div className="section-header">
                        <span><i className="bi bi-graph-up-arrow me-2"></i>Sales Report</span>
                    </div>

                    <p className="small mb-4" style={{ color: '#94a3b8' }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Shows total revenue (sale value) and units sold. Cancelled orders are excluded.
                    </p>

                    {
                        errMsg !== undefined ?
                            <div className="alert border-0 mb-3" style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '.5rem' }}>{errMsg}</div> : ""
                    }

                    {
                        loading ?
                            <div className="text-center py-5" style={{ color: '#94a3b8' }}>
                                <div className="spinner-border" style={{ color: '#3b82f6' }} role="status"></div>
                                <p className="mt-2">Loading report...</p>
                            </div> :
                            report &&
                            <div>
                                {/* Headline totals */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <div className="card border-0 p-3 h-100" style={{ background: '#eff6ff', borderRadius: '.75rem', border: '1.5px solid #bfdbfe' }}>
                                            <span className="small fw-semibold" style={{ color: '#1e3a5f' }}>Total Revenue</span>
                                            <span className="fw-black fs-4 mt-1" style={{ color: '#1d4ed8' }}>₹{report.totalRevenue.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card border-0 p-3 h-100" style={{ background: '#f0f9ff', borderRadius: '.75rem', border: '1.5px solid #a5f3fc' }}>
                                            <span className="small fw-semibold" style={{ color: '#155e75' }}>Total Orders</span>
                                            <span className="fw-black fs-4 mt-1" style={{ color: '#0ea5e9' }}>{report.totalOrders}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card border-0 p-3 h-100" style={{ background: '#d1fae5', borderRadius: '.75rem', border: '1.5px solid #6ee7b7' }}>
                                            <span className="small fw-semibold" style={{ color: '#065f46' }}>Total Items Sold</span>
                                            <span className="fw-black fs-4 mt-1" style={{ color: '#10b981' }}>{report.totalItemsSold}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly revenue chart */}
                                {
                                    report.monthlyRevenue.length > 0 ?
                                        <div className="card border-0 p-3 mb-4" style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)' }}>
                                            <h6 className="fw-bold mb-3" style={{ color: '#0f2942' }}>Revenue by Month</h6>
                                            <div style={{ height: '300px' }}>
                                                <canvas ref={chartRef}></canvas>
                                            </div>
                                        </div> : ""
                                }

                                {/* Monthly revenue table */}
                                <div className="card border-0 mb-4" style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(59,130,246,0.07)' }}>
                                    <div className="card-body p-0">
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="table table-hover mb-0">
                                                <thead>
                                                    <tr style={{ background: '#eff6ff' }}>
                                                        {['Month', 'Revenue', 'Orders', 'Items Sold'].map((h, i) => (
                                                            <th key={i} style={{ color: '#1e40af', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #bfdbfe' }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        report.monthlyRevenue.length > 0 ?
                                                            report.monthlyRevenue.map((m, index) => (
                                                                <tr key={index}>
                                                                    <td className="fw-semibold" style={{ color: '#0f2942' }}>{m.monthLabel}</td>
                                                                    <td className="fw-bold" style={{ color: '#1d4ed8' }}>₹{m.revenue.toLocaleString('en-IN')}</td>
                                                                    <td>{m.ordersCount}</td>
                                                                    <td>{m.itemsSold}</td>
                                                                </tr>
                                                            )) :
                                                            <tr><td colSpan="4" className="text-center text-muted py-4">No sales data yet.</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Top selling products */}
                                <div className="card border-0" style={{ borderRadius: '.75rem', boxShadow: '0 2px 10px rgba(14,165,233,0.09)' }}>
                                    <div className="card-body p-0">
                                        <div className="px-3 pt-3">
                                            <h6 className="fw-bold mb-2" style={{ color: '#0f2942' }}>
                                                <i className="bi bi-trophy me-2"></i>Top Selling Products
                                            </h6>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="table table-hover mb-0">
                                                <thead>
                                                    <tr style={{ background: '#f0f9ff' }}>
                                                        {['Rank', 'Product', 'Seller', 'Units Sold', 'Revenue'].map((h, i) => (
                                                            <th key={i} style={{ color: '#155e75', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: '2px solid #a5f3fc' }}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        report.topProducts.length > 0 ?
                                                            report.topProducts.slice(0, 10).map((p, index) => (
                                                                <tr key={index}>
                                                                    <td className="fw-semibold" style={{ color: '#0ea5e9' }}>#{index + 1}</td>
                                                                    <td style={{ color: '#0f2942' }}>{p.productName}</td>
                                                                    <td className="text-muted small">{p.sellerName}</td>
                                                                    <td className="fw-semibold">{p.unitsSold}</td>
                                                                    <td className="fw-bold" style={{ color: '#0ea5e9' }}>₹{p.revenue.toLocaleString('en-IN')}</td>
                                                                </tr>
                                                            )) :
                                                            <tr><td colSpan="5" className="text-center text-muted py-4">No sales data yet.</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default SalesReport
