import express from 'express'
import { authMiddlware } from '../middleware/authMiddleware.js'
import Book from '../models/Book.js'

const router = express.Router()

router.post('/', authMiddlware, async (req, res) => {
  try {
    const { title, author, description } = req.body
    const book = new Book({
      title,
      author,
      description,
      user: req.user.id
    })
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', authMiddlware, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id })
    res.json(books)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
