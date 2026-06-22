import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const CATEGORIES = [
    { label: "Electronics", icon: "bi-cpu", color: "#f59e0b" },
    { label: "Fashion", icon: "bi-bag", color: "#ec4899" },
    { label: "Furniture", icon: "bi-house-heart", color: "#8b5cf6" },
    { label: "Mobile", icon: "bi-phone", color: "#10b981" },
    { label: "Books", icon: "bi-book", color: "#3b82f6" },
    { label: "Kitchen", icon: "bi-cup-hot", color: "#f97316" },
]

const STATS = [
    { num: "50K+", label: "Products" },
    { num: "12K+", label: "Customers" },
    { num: "3K+", label: "Sellers" },
    { num: "99%", label: "Satisfaction" },
]

const Home = () => {
    const [activeCategory, setActiveCategory] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setActiveCategory(p => (p + 1) % CATEGORIES.length), 2000)
        return () => clearInterval(t)
    }, [])

    return (
        <div style={{ background: "#fff5f0", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: "hidden" }}>

            {/* ── Navbar ── */}
            <nav style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.85rem 3rem", background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100,
                borderBottom: "1px solid rgba(0,0,0,0.06)", flexWrap: "wrap", gap: "0.75rem"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                        width: 34, height: 34, borderRadius: "10px",
                        background: "linear-gradient(135deg,#f97316,#ec4899)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <i className="bi bi-bag-heart-fill" style={{ color: "#fff", fontSize: "1rem" }}></i>
                    </span>
                    <span style={{ fontWeight: 900, fontSize: "1.25rem", color: "#1a1a1a", letterSpacing: "-0.5px" }}>QuitQ</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <Link to="/login">
                        <button style={{
                            background: "linear-gradient(135deg,#f97316,#ec4899)", border: "none",
                            borderRadius: "2rem", padding: "0.45rem 1.25rem",
                            color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
                        }}>
                            <i className="bi bi-box-arrow-in-right me-1"></i>Login
                        </button>
                    </Link>
                    <Link to="/register/customer">
                        <button style={{
                            background: "#fff", border: "2px solid #f97316",
                            borderRadius: "2rem", padding: "0.4rem 1.1rem",
                            color: "#f97316", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
                        }}>Register</button>
                    </Link>
                    <Link to="/register/seller">
                        <button style={{
                            background: "#fff", border: "2px solid #ec4899",
                            borderRadius: "2rem", padding: "0.4rem 1.1rem",
                            color: "#ec4899", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                            display: "flex", alignItems: "center", gap: "0.35rem"
                        }}><i className="bi bi-shop"></i>Sell on QuitQ</button>
                    </Link>
                </div>
            </nav>

            {/* ── Hero (fills remaining viewport so the page stays a single scroll) ── */}
            <div style={{
                flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1.5rem 3rem", maxWidth: 1200, margin: "0 auto", gap: "2rem",
                flexWrap: "wrap", width: "100%"
            }}>
                {/* Left text */}
                <div style={{ flex: "1 1 420px", maxWidth: 480 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        background: "#fde8d8", borderRadius: "2rem", padding: "0.3rem 0.9rem",
                        marginBottom: "1rem"
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316", display: "inline-block" }}></span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#c2410c", letterSpacing: "0.08em", textTransform: "uppercase" }}>India's Growing Marketplace</span>
                    </div>

                    <h1 style={{
                        fontSize: "clamp(2rem, 4.2vw, 2.9rem)", fontWeight: 900, lineHeight: 1.12,
                        color: "#1a1a1a", marginBottom: "0.5rem", letterSpacing: "-1.5px"
                    }}>
                        Shop <span style={{ color: "#f97316" }}>Everything</span> You Love
                    </h1>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.16em", color: "#e879a0", textTransform: "uppercase", marginBottom: "1rem" }}>
                        SUPPORT LOCAL · BUY SMART · SELL MORE
                    </p>
                    <p style={{ color: "#666", fontSize: "0.98rem", lineHeight: 1.6, marginBottom: "1.25rem", maxWidth: 420 }}>
                        QuitQ connects buyers and sellers across India. Browse thousands of products, place orders, and track deliveries — all in one place.
                    </p>

                    {/* Category chips */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        {CATEGORIES.map((c, i) => (
                            <span key={i} style={{
                                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                background: activeCategory === i ? c.color : "#fff",
                                color: activeCategory === i ? "#fff" : "#444",
                                border: `1.5px solid ${activeCategory === i ? c.color : "#e5e7eb"}`,
                                borderRadius: "2rem", padding: "0.3rem 0.85rem",
                                fontSize: "0.8rem", fontWeight: 600,
                                transition: "all 0.3s ease", cursor: "pointer",
                                boxShadow: activeCategory === i ? `0 4px 12px ${c.color}44` : "none"
                            }} onClick={() => setActiveCategory(i)}>
                                <i className={`bi ${c.icon}`} style={{ fontSize: "0.76rem" }}></i>
                                {c.label}
                            </span>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                        <Link to="/register/customer">
                            <button style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                background: "linear-gradient(135deg,#f97316,#ec4899)",
                                border: "none", borderRadius: "3rem",
                                padding: "0.7rem 1.6rem", color: "#fff",
                                fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                                boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(249,115,22,0.5)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.4)"; }}>
                                <i className="bi bi-bag-heart-fill"></i>
                                Shop Now
                            </button>
                        </Link>
                        <Link to="/register/seller">
                            <button style={{
                                background: "#fff", border: "2px solid #f97316",
                                borderRadius: "3rem", padding: "0.67rem 1.6rem",
                                color: "#f97316", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fff5f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                                <i className="bi bi-shop me-2"></i>Start Selling
                            </button>
                        </Link>
                    </div>

                    {/* Compact inline stats — replaces the old full-width stats banner */}
                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                        {STATS.map((s, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                                <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "#1a1a1a" }}>{s.num}</span>
                                <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right hero graphic */}
                <div style={{ flex: "1 1 320px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/* Big circle bg */}
                    <div style={{
                        width: 300, height: 300, borderRadius: "50%",
                        background: "linear-gradient(135deg,#fcd5b4,#f9a8d4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative"
                    }}>
                        {/* Center icon */}
                        <div style={{ textAlign: "center" }}>
                            <i className="bi bi-bag-heart-fill" style={{ fontSize: "5.5rem", color: "#fff", filter: "drop-shadow(0 8px 24px rgba(249,115,22,0.3))" }}></i>
                            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginTop: "-0.4rem" }}>QuitQ</div>
                        </div>

                        {/* Floating pill — top right */}
                        <div style={{
                            position: "absolute", top: 18, right: -30,
                            background: "#fff", borderRadius: "3rem",
                            padding: "0.45rem 0.95rem",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            fontWeight: 700, fontSize: "0.8rem", color: "#1a1a1a",
                            animation: "floatUp 3s ease-in-out infinite"
                        }}>
                            <i className="bi bi-stars" style={{ color: "#f59e0b" }}></i>
                            Top Rated
                        </div>

                        {/* Floating pill — bottom left */}
                        <div style={{
                            position: "absolute", bottom: 40, left: -40,
                            background: "#fff", borderRadius: "3rem",
                            padding: "0.45rem 0.95rem",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            fontWeight: 700, fontSize: "0.8rem", color: "#1a1a1a",
                            animation: "floatDown 3.5s ease-in-out infinite"
                        }}>
                            <i className="bi bi-lightning-charge-fill" style={{ color: "#ec4899" }}></i>
                            Fast Delivery
                        </div>

                        {/* Small circle thumbnails */}
                        {[
                            { icon: "bi-cpu-fill", color: "#f59e0b", top: -16, left: 45 },
                            { icon: "bi-phone-fill", color: "#10b981", top: 25, left: -25 },
                            { icon: "bi-book-fill", color: "#8b5cf6", bottom: -8, right: 55 },
                        ].map((c, i) => (
                            <div key={i} style={{
                                position: "absolute", top: c.top, bottom: c.bottom, left: c.left, right: c.right,
                                width: 46, height: 46, borderRadius: "50%",
                                background: `${c.color}22`, border: `2px solid ${c.color}55`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                            }}>
                                <i className={`bi ${c.icon}`} style={{ color: c.color, fontSize: "1.2rem" }}></i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                textAlign: "center", padding: "0.85rem",
                borderTop: "1px solid #f0e8e0",
                color: "#aaa", fontSize: "0.78rem", fontWeight: 500
            }}>
                © 2025 QuitQ Ecom &nbsp;·&nbsp; Built with React + Spring Boot &nbsp;·&nbsp; Made in India 🇮🇳
            </div>

            <style>{`
                @keyframes floatUp {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes floatDown {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }
            `}</style>
        </div>
    )
}

export default Home
