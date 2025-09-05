import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'

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

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server runnning on port ${PORT}`))
