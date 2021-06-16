const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = (req, res, next) => {
  const authToken = req.cookies.accessToken
  // const refreshToken = req.cookies.refreshToken

  if (authToken) {
    jwt.verify(authToken, process.env.JWT_SECRET || `secret`, async (err, user) => {
      if (err) {
        return res.redirect(`/users/signin?back=${req.originalUrl}`)
      }

      req.user = await User.findByUsername(user.username)
      next()
    })
  } else {
    return res.redirect(`/users/signin?back=${req.originalUrl}`)
  }
}

module.exports = auth