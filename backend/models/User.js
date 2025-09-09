import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

userSchema.path('password').validate(function (value) {
  return value.length >= 8
}, 'Password must be at least 8 characters long')

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
