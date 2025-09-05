import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import { authMiddlware } from '../middleware/authMiddleware.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Vérif utilisateur existant
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'This email is already used' })

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création user
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérif si user existe
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'User not found' })

    // Vérif mot de passe
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Incorrect login' })

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1h' }
    )

    res.status(200).json({ token, username: user.username, email: user.email })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error', error })
  }
})

router.get('/me', authMiddlware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
