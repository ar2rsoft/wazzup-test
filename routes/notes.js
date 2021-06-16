const express = require('express')
const router = express.Router()
const Note = require('../models/note')
const { body, validationResult, query } = require('express-validator')
const auth = require('../middlewares/auth')

router.get(
  '/shared/:userId/:shareId',
  async function (req, res) {
    if (!req.params.userId || !req.params.shareId) {
      return res.status(404).send('Incorrect link')
    }
    const note = await Note.findOneByShareId(req.params.userId, req.params.shareId)
    if (!note) {
      return res.status(404).send('Note not found')
    }
    const user = await note.user();
    if (!note) {
      return res.status(404).send('User of note not found')
    }

    return res.render('notes/view', { note, user });
  },
)

router.get(
  '/share',
  auth,
  async function (req, res) {
    if (!req.query.id) {
      return res.status(404).send('Param "id" is required');
    }
    const note = await Note.findOneById(req.query.id)
    await note.share()
    return res.redirect(req.query.back || '/notes/list');
  },
)

router.get(
  '/unshare',
  auth,
  async function (req, res) {
    if (!req.query.id) {
      return res.status(404).send('Param "id" is required');
    }
    const note = await Note.findOneById(req.query.id)
    await note.unshare()
    return res.redirect(req.query.back || '/notes/list');
  },
)

router.get(
  '/edit',
  auth,
  query('id').custom(async (value, { req }) => {
    const note = await Note.findOneById(value)
    if (!note) {
      throw new Error('Not not found')
    }
    req.note = note
  }),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).
        render('notes/not-found', { errors: errors.array(), ...req.body })
    }

    const note = await Note.findOneById(req.query.id)
    return res.render('notes/edit', { note })
  },
)

router.post(
  '/edit',
  auth,
  body('text').
    isLength({ max: 1000 }).
    withMessage('Must be not more 1000 chars long'),
  query('id').custom(async (value, { req }) => {
    const note = await Note.findOneById(value)
    if (!note) {
      throw new Error('Not not found')
    }
    req.note = note
  }),
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).
        render('notes/not-found', { errors: errors.array(), ...req.body })
    }

    const note = req.note;
    note.text = req.body.text
    await note.save();

    return res.render('notes/edit', { note, saved: true })
    return res.render('notes/edit', { note, saved: true })
  },
)

router.post(
  '/delete',
  auth,
  async function (req, res) {
    const note = await Note.findOneById(req.body.id)
    if (note) {
      await note.delete();
    }
    return res.redirect('/notes/list')
  },
)

router.get(
  '/list',
  auth,
  async function (req, res, next) {
    const limit = 10
    const page = req.query.page || 0

    const notes = await Note.findByUserId(req.user.id, page * limit, limit)
    console.log(notes)
    const count = Note.lastTotalCount

    return res.render(
      'notes/list',
      { notes, page, pageCount: Math.floor(count / limit) })
  },
)

router.get(
  '/add',
  auth,
  async function (req, res, next) {
    return res.render('notes/add')
  },
)

router.post(
  '/add',
  auth,
  body('text').
    isLength({ max: 1000 }).
    withMessage('Must be not more 1000 chars long'),
  async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).
        render('notes/add', { errors: errors.array(), ...req.body })
    }

    const note = await Note.create({
      user_id: req.user.id,
      text: req.body.text,
    })

    return res.redirect('/notes/list')
  },
)

module.exports = router
