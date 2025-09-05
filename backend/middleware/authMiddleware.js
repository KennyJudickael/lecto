import jwt from 'jsonwebtoken'

export const authMiddlware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'missing token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')
    req.user = decoded
    next()
  } catch (error) {
    console.error(error)
    res.status(403).json({ message: 'Expired token' })
  }
}
