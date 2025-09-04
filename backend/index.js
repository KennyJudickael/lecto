import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import User from './models/User.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connecteed'))
  .catch((err) => console.error('DB connection error', err))

app.get('/', (req, res) => {
  res.send('Backend runnning')
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Backend' })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`))
