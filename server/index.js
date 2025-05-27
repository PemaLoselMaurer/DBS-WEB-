import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

// --- Role-based middleware ---
function requireRole(roles) {
  return (req, res, next) => {
    // For demo: get role from header. In production, use JWT/session.
    const userRole = req.headers['x-role']
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' })
    }
    next()
  }
}

// --- Example: Protect endpoints by role ---

// Only admin can access all members
app.get('/api/members', requireRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Member"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Receptionist and admin can add members
app.post('/api/members', requireRole(['admin', 'receptionist']), async (req, res) => {
  const { trainer_id, membership_plan_id, name, email, phone, join_date } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "Member" (trainer_id, membership_plan_id, name, email, phone, join_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [trainer_id, membership_plan_id, name, email, phone, join_date]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Trainer can only view members (read-only)
app.get('/api/members/view', requireRole(['trainer']), async (req, res) => {
  try {
    const result = await pool.query('SELECT member_id, name, email, phone FROM "Member"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Example: Only admin can delete a member
app.delete('/api/members/:id', requireRole(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM "Member" WHERE member_id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// MembershipPlan endpoints
app.get('/api/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "MembershipPlan"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/plans', async (req, res) => {
  const { name, duration, price, description } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "MembershipPlan" (name, duration, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, duration, price, description]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Payment endpoints
app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Payment"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/payments', async (req, res) => {
  const { membership_plan_id, amount, payment_date, due_date, status } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "Payment" (membership_plan_id, amount, payment_date, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [membership_plan_id, amount, payment_date, due_date, status]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Attendance endpoints
app.get('/api/attendance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Attendece"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/attendance', async (req, res) => {
  const { membership_plan_id, check_in_time, check_out_time } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "Attendece" (membership_plan_id, check_in_time, check_out_time) VALUES ($1, $2, $3) RETURNING *',
      [membership_plan_id, check_in_time, check_out_time]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Specialization endpoints
app.get('/api/specializations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Specialization"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/specializations', async (req, res) => {
  const { name, description } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "Specialization" (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Trainer endpoints
app.get('/api/trainers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Trainer"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/trainers', async (req, res) => {
  const { name, email, phone, availability } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "Trainer" (name, email, phone, availability) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, availability]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// SpecializationTrainer endpoints
app.get('/api/specialization-trainers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "SpecializationTrainer"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/specialization-trainers', async (req, res) => {
  const { trainer_id, specialization_id } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO "SpecializationTrainer" (trainer_id, specialization_id) VALUES ($1, $2) RETURNING *',
      [trainer_id, specialization_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Member Registration
app.post('/api/members/register', async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO "Member" (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, hashedPassword]
    )
    res.status(201).json({ message: 'Member registered', member: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Member Login
app.post('/api/members/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM "Member" WHERE email = $1', [email])
    const member = result.rows[0]
    if (!member) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, member.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ message: 'Login successful', member })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Trainer Registration
app.post('/api/trainers/register', async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO "Trainer" (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, hashedPassword]
    )
    res.status(201).json({ message: 'Trainer registered', trainer: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Trainer Login
app.post('/api/trainers/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM "Trainer" WHERE email = $1', [email])
    const trainer = result.rows[0]
    if (!trainer) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, trainer.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ message: 'Login successful', trainer })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Registration
app.post('/api/admins/register', async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO "Admin" (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, hashedPassword]
    )
    res.status(201).json({ message: 'Admin registered', admin: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Login
app.post('/api/admins/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM "Admin" WHERE email = $1', [email])
    const admin = result.rows[0]
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, admin.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ message: 'Login successful', admin })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Receptionist Registration
app.post('/api/receptionists/register', async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO "Receptionist" (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, hashedPassword]
    )
    res.status(201).json({ message: 'Receptionist registered', receptionist: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Receptionist Login
app.post('/api/receptionists/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM "Receptionist" WHERE email = $1', [email])
    const receptionist = result.rows[0]
    if (!receptionist) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, receptionist.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    res.json({ message: 'Login successful', receptionist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Generic GET endpoints for all entities
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Member"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/trainers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Trainer"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "MembershipPlan"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/payments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Payment"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/attendance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Attendece"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/specializations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Specialization"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/specialization-trainers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "SpecializationTrainer"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
