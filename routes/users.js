const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const refreshTokenSecret = 'yourrefreshtokensecrethere'
const refreshTokens = []

/* User signup */
router.get('/signup', async function (req, res, next) {
  return res.render('signup')
})

router.post(
  '/signup',
  body('username').isLength({ min: 3, max: 20 }),
  body('username').custom(value => {
    return User.findByUsername(value).then(user => {
      if (user) {
        return Promise.reject('Username already in use')
      }
    })
  }),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).
        render('signup', { errors: errors.array(), ...req.body })
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    })

    return res.render('signup-success', { user })
  })

router.get('/signin', async function (req, res, next) {
  return res.render('signin', { back: req.query.back || false })
})

router.post(
  '/signin',
  body('username').custom(async (name, { req }) => {
    return User.findByUsernameAndPassword(name, req.body.password).
      then(user => {
        if (!user) {
          return Promise.reject('Username and/or password incorrect')
        }
      })
  }),
  async function (req, res) {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).
        render('signin', { errors: errors.array(), ...req.body })
    }

    const user = await User.findByUsernameAndPassword(
      req.body.username,
      req.body.password,
    )
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET || `secret`,
      { expiresIn: '20m' },
    )

    const refreshToken = jwt.sign(
      { username: user.username, role: user.role },
      refreshTokenSecret,
    )

    refreshTokens.push(refreshToken)

    res.cookie('accessToken' ,accessToken)
    res.cookie('refreshToken' ,refreshToken)

    return res.redirect(req.body.back || '/')
  },
)

router.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET || `secret`, { expiresIn: '20m' });

    res.json({
      accessToken
    });
  });
});

module.exports = router
