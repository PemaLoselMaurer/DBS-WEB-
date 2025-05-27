import express from 'express'
import cors from 'cors'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

// Member endpoints
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Member"')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/members', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
