import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './App.css'

// Topbar authentication links
function TopbarAuthLinks() {
  const location = useLocation()
  return null // Hide separate links, handled in login/register toggles now
}

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
        {/* <Link to="/register-member" className={`sidebar-link${location.pathname === '/register-member' ? ' active' : ''}`}>Register Member</Link> */}
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
    <div className="home-container" style={{ marginTop: 0, paddingTop: 0 }}>
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

// Utility fetch hooks for all entities
function useFetchList(endpoint) {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch(`http://localhost:4000/api/${endpoint}`)
      .then(res => res.json())
      .then(setData)
  }, [endpoint])
  return data
}

// Members
function Members() {
  const members = useFetchList('members')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    join_date: '',
    trainer_id: '',
    membership_plan_id: ''
  })
  const [msg, setMsg] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    const res = await fetch('http://localhost:4000/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': 'receptionist' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Member registered')
    if (!data.error) {
      setForm({
        name: '',
        email: '',
        phone: '',
        join_date: '',
        trainer_id: '',
        membership_plan_id: ''
      })
    }
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <div className="members-container" style={{ flex: 1 }}>
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
      <div className="section-container" style={{ minWidth: 320, maxWidth: 400 }}>
        <h2>Register New Member</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="join_date" placeholder="Join Date" value={form.join_date} onChange={handleChange} required type="date" />
          <input name="trainer_id" placeholder="Trainer ID" value={form.trainer_id} onChange={handleChange} required />
          <input name="membership_plan_id" placeholder="Membership Plan ID" value={form.membership_plan_id} onChange={handleChange} required />
          <button type="submit">Register Member</button>
        </form>
        {msg && <div className="auth-msg">{msg}</div>}
      </div>
    </div>
  )
}

// Register New Member (separate page/component)
function MemberRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    join_date: '',
    trainer_id: '',
    membership_plan_id: ''
  })
  const [msg, setMsg] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    const res = await fetch('http://localhost:4000/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': 'receptionist' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMsg(data.message || data.error || 'Member registered')
    if (!data.error) {
      setForm({
        name: '',
        email: '',
        phone: '',
        join_date: '',
        trainer_id: '',
        membership_plan_id: ''
      })
    }
  }

  return (
    <div className="section-container">
      <h2>Register New Member</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="join_date" placeholder="Join Date" value={form.join_date} onChange={handleChange} required type="date" />
        <input name="trainer_id" placeholder="Trainer ID" value={form.trainer_id} onChange={handleChange} required />
        <input name="membership_plan_id" placeholder="Membership Plan ID" value={form.membership_plan_id} onChange={handleChange} required />
        <button type="submit">Register Member</button>
      </form>
      {msg && <div className="auth-msg">{msg}</div>}
    </div>
  )
}

// Trainers
function Trainers() {
  const trainers = useFetchList('trainers')
  return (
    <div className="section-container">
      <h2>Trainers</h2>
      <div className="members-list">
        {trainers.length === 0 && <p>No trainers found.</p>}
        {trainers.map(t => (
          <div className="member-card" key={t.trainer_id}>
            <div className="member-avatar">{t.name?.[0]?.toUpperCase() || '?'}</div>
            <div>
              <div className="member-name">{t.name}</div>
              <div className="member-email">{t.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Membership Plans
function Plans() {
  const plans = useFetchList('plans')
  return (
    <div className="section-container">
      <h2>Membership Plans</h2>
      <div className="members-list">
        {plans.length === 0 && <p>No plans found.</p>}
        {plans.map(p => (
          <div className="member-card" key={p.membership_plan_id}>
            <div className="member-name">{p.name}</div>
            <div className="member-email">Duration: {p.duration} | Price: {p.price}</div>
            <div className="member-email">{p.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Payments
function Payments() {
  const payments = useFetchList('payments')
  return (
    <div className="section-container">
      <h2>Payments</h2>
      <div className="members-list">
        {payments.length === 0 && <p>No payments found.</p>}
        {payments.map(p => (
          <div className="member-card" key={p.payment_id}>
            <div className="member-name">Amount: {p.amount}</div>
            <div className="member-email">Status: {p.status}</div>
            <div className="member-email">Payment Date: {p.payment_date}</div>
            <div className="member-email">Due Date: {p.due_date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Attendance
function Attendance() {
  const attendance = useFetchList('attendance')
  return (
    <div className="section-container">
      <h2>Attendance</h2>
      <div className="members-list">
        {attendance.length === 0 && <p>No attendance records found.</p>}
        {attendance.map(a => (
          <div className="member-card" key={a.attendence_id}>
            <div className="member-name">Check-in: {a.check_in_time}</div>
            <div className="member-email">Check-out: {a.check_out_time}</div>
            <div className="member-email">Membership Plan ID: {a.membership_plan_id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Specializations
function Specializations() {
  const specializations = useFetchList('specializations')
  return (
    <div className="section-container">
      <h2>Specializations</h2>
      <div className="members-list">
        {specializations.length === 0 && <p>No specializations found.</p>}
        {specializations.map(s => (
          <div className="member-card" key={s.specialization_id}>
            <div className="member-name">{s.name}</div>
            <div className="member-email">{s.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Specialization-Trainers
function SpecializationTrainers() {
  const specializationTrainers = useFetchList('specialization-trainers')
  return (
    <div className="section-container">
      <h2>Specialization-Trainers</h2>
      <div className="members-list">
        {specializationTrainers.length === 0 && <p>No specialization-trainer links found.</p>}
        {specializationTrainers.map(st => (
          <div className="member-card" key={st.trainer_id + '-' + st.specialization_id}>
            <div className="member-name">Trainer ID: {st.trainer_id}</div>
            <div className="member-email">Specialization ID: {st.specialization_id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Role-based Login/Register (single component for all roles)
function UserLogin() {
  const [role, setRole] = useState('admin')
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [registerMsg, setRegisterMsg] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleRegisterChange = e => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    let url = ''
    if (role === 'admin') url = 'http://localhost:4000/api/admins/login'
    else if (role === 'trainer') url = 'http://localhost:4000/api/trainers/login'
    else url = 'http://localhost:4000/api/receptionists/login'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMsg(data.message || data.error)
    // Optionally, store role in localStorage/session
    if (data.message && !data.error) localStorage.setItem('role', role)
  }

  const handleRegisterSubmit = async e => {
    e.preventDefault()
    setRegisterMsg('')
    let url = ''
    if (role === 'admin') url = 'http://localhost:4000/api/admins/register'
    else if (role === 'trainer') url = 'http://localhost:4000/api/trainers/register'
    else url = 'http://localhost:4000/api/receptionists/register'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    })
    const data = await res.json()
    setRegisterMsg(data.message || data.error)
  }

  return (
    <div className="section-container">
      <div style={{ marginBottom: '1.2rem' }}>
        <label style={{ fontWeight: 600, marginRight: 10 }}>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
          <option value="receptionist">Receptionist</option>
        </select>
      </div>
      {!showRegister ? (
        <>
          <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
            <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" />
            <button type="submit">Login</button>
          </form>
          {msg && <div className="auth-msg">{msg}</div>}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="auth-form-toggle" onClick={() => setShowRegister(true)}>
              Don't have an account? Register
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Register</h2>
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <input name="name" placeholder="Name" value={registerForm.name} onChange={handleRegisterChange} required />
            <input name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} required type="email" />
            <input name="phone" placeholder="Phone" value={registerForm.phone} onChange={handleRegisterChange} required />
            <input name="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} required type="password" />
            <button type="submit">Register</button>
          </form>
          {registerMsg && <div className="auth-msg">{registerMsg}</div>}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="auth-form-toggle" onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Trainer Login (with Register toggle)
function TrainerLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [registerMsg, setRegisterMsg] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    const res = await fetch('http://localhost:4000/api/trainers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setMsg(data.message || data.error)
  }

  // Register logic
  const handleRegisterChange = e => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })
  const handleRegisterSubmit = async e => {
    e.preventDefault()
    setRegisterMsg('')
    const res = await fetch('http://localhost:4000/api/trainers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    })
    const data = await res.json()
    setRegisterMsg(data.message || data.error)
  }

  return (
    <div className="section-container">
      {!showRegister ? (
        <>
          <h2>Trainer Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
            <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" />
            <button type="submit">Login</button>
          </form>
          {msg && <div className="auth-msg">{msg}</div>}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="auth-form-toggle" onClick={() => setShowRegister(true)}>
              Don't have an account? Register
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Trainer Register</h2>
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <input name="name" placeholder="Name" value={registerForm.name} onChange={handleRegisterChange} required />
            <input name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} required type="email" />
            <input name="phone" placeholder="Phone" value={registerForm.phone} onChange={handleRegisterChange} required />
            <input name="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} required type="password" />
            <button type="submit">Register</button>
          </form>
          {registerMsg && <div className="auth-msg">{registerMsg}</div>}
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="auth-form-toggle" onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Topbar authentication links content (always visible in top right)
function TopbarAuthLinksContent() {
  const location = useLocation()
  return (
    <div className="topbar-auth-links">
      <Link to="/member-login" className={`topbar-link${location.pathname === '/member-login' ? ' active' : ''}`}>Member Login</Link>
      <Link to="/trainer-login" className={`topbar-link${location.pathname === '/trainer-login' ? ' active' : ''}`}>Trainer Login</Link>
    </div>
  )
}

function TopbarProfileDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="topbar-profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-icon-btn"
        aria-label="Profile"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        <span className="profile-icon" role="img" aria-label="profile">👤</span>
      </button>
      {open && (
        <div className="profile-dropdown-menu">
          <Link to="/login" className="dropdown-link">Login / Register</Link>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app-layout" style={{ flexDirection: 'row', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
        <Sidebar />
        <div className="main-area">
          <div className="topbar-auth-container">
            <TopbarProfileDropdown />
          </div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/register-member" element={<MemberRegister />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/specializations" element={<Specializations />} />
              <Route path="/specialization-trainers" element={<SpecializationTrainers />} />
              <Route path="/login" element={<UserLogin />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
