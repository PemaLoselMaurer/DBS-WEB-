import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Sidebar component
function Sidebar() {
  const location = useLocation()
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <img src="/src/assets/logo.svg" alt="PJNN FITNESS Logo" style={{ width: 64, height: 64 }} />
        <span style={{ fontSize: '1.6rem', fontWeight: 700 }}>PJNN FITNESS</span>
      </div>
      <div className="sidebar-links">
        <Link to="/" className={`sidebar-link${location.pathname === '/' ? ' active' : ''}`}>Dashboard</Link>
        <Link to="/members" className={`sidebar-link${location.pathname === '/members' ? ' active' : ''}`}>Members</Link>
        <Link to="/trainers" className={`sidebar-link${location.pathname === '/trainers' ? ' active' : ''}`}>Trainers</Link>
        <Link to="/plans" className={`sidebar-link${location.pathname === '/plans' ? ' active' : ''}`}>Membership Plans</Link>
        <Link to="/payments" className={`sidebar-link${location.pathname === '/payments' ? ' active' : ''}`}>Payments</Link>
        <Link to="/attendance" className={`sidebar-link${location.pathname === '/attendance' ? ' active' : ''}`}>Attendance</Link>
        <Link to="/specializations" className={`sidebar-link${location.pathname === '/specializations' ? ' active' : ''}`}>Specializations</Link>
        <Link to="/specialization-trainers" className={`sidebar-link${location.pathname === '/specialization-trainers' ? ' active' : ''}`}>Specialization-Trainers</Link>
      </div>
    </aside>
  )
}

// Dashboard/Home
function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="home-container">
      <h1 className="main-title">Welcome to PJNN FITNESS Management</h1>
      <p className="subtitle">
        Manage your fitness club's members, trainers, plans, payments, attendance, and more.
      </p>
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/members')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="members">🧑‍🤝‍🧑</span>
          <h3>Members</h3>
          <p>View and manage all club members.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/trainers')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="trainers">🏃‍♂️</span>
          <h3>Trainers</h3>
          <p>Meet our professional trainers.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/plans')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="plans">📋</span>
          <h3>Membership Plans</h3>
          <p>Explore membership plans and offers.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/payments')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="payments">💳</span>
          <h3>Payments</h3>
          <p>Track all payments and dues.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="attendance">🕒</span>
          <h3>Attendance</h3>
          <p>Monitor member attendance.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/specializations')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="specializations">🏅</span>
          <h3>Specializations</h3>
          <p>Trainer specializations and skills.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/specialization-trainers')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="specialization-trainers">🤝</span>
          <h3>Specialization-Trainers</h3>
          <p>Link trainers to their specializations.</p>
        </div>
      </div>
    </div>
  )
}

// Members
function Members() {
  const [members, setMembers] = useState([])
  useEffect(() => {
    fetch('http://localhost:4000/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
  }, [])
  return (
    <div className="members-container">
      <h2>Members</h2>
      <div className="members-list">
        {members.length === 0 && <p>No members found.</p>}
        {members.map(m => (
          <div className="member-card" key={m.member_id}>
            <div className="member-avatar">{m.name?.[0]?.toUpperCase() || '?'}</div>
            <div>
              <div className="member-name">{m.name}</div>
              <div className="member-email">{m.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Trainers placeholder
function Trainers() {
  return (
    <div className="section-container">
      <h2>Trainers</h2>
      <p>Trainer management coming soon.</p>
    </div>
  )
}

// Membership Plans placeholder
function Plans() {
  return (
    <div className="section-container">
      <h2>Membership Plans</h2>
      <p>Membership plan management coming soon.</p>
    </div>
  )
}

// Payments placeholder
function Payments() {
  return (
    <div className="section-container">
      <h2>Payments</h2>
      <p>Payment management coming soon.</p>
    </div>
  )
}

// Attendance placeholder
function Attendance() {
  return (
    <div className="section-container">
      <h2>Attendance</h2>
      <p>Attendance management coming soon.</p>
    </div>
  )
}

// Specializations placeholder
function Specializations() {
  return (
    <div className="section-container">
      <h2>Specializations</h2>
      <p>Specialization management coming soon.</p>
    </div>
  )
}

// Specialization-Trainers placeholder
function SpecializationTrainers() {
  return (
    <div className="section-container">
      <h2>Specialization-Trainers</h2>
      <p>Specialization-Trainer linking coming soon.</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app-layout" style={{ flexDirection: 'row', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
        <Sidebar />
        <main className="main-content" style={{ width: '100%', minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/specializations" element={<Specializations />} />
            <Route path="/specialization-trainers" element={<SpecializationTrainers />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
