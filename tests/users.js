const chai = require('chai')
chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')
const User = require('../models/user')

const USERNAME = 'test'
const PASSWORD = 'qwerty'

//1. тестируемый модуль
describe('Users', function () {
  before(async () => {
    const user = await User.findByUsername(USERNAME)
    if (user) {
      await user.delete()
    }
    await User.create({
      username: USERNAME,
      password: PASSWORD,
    })
  })

  describe('Signin', async () => {
    it('Signin with correct username/password', async () => {
      const agent = chai.request.agent(app)

      await agent.post('/users/signin').type('form').send({
        '_method': 'post',
        'username': USERNAME,
        'password': PASSWORD,
      })

      const { res } = await agent.get('/notes/list')

      expect(res.text).contains('All notes')
      expect(res.text).not.contains('Login')
    })

    it('Signin with incorrect username/password', async () => {
      const agent = chai.request.agent(app)

      await agent.post('/users/signin').type('form').send({
        '_method': 'post',
        'username': 'incorrect_username',
        'password': 'incorrect_password',
      })

      const { res } = await agent.get('/notes/list')

      expect(res.text).not.contains('All notes')
      expect(res.text).contains('Login')
    })
  })

  describe('Signup', async () => {
    it('When register with short username get an error', async () => {
      const agent = chai.request.agent(app)

      await agent.post('/users/signin').type('form').send({
        '_method': 'post',
        'username': USERNAME,
        'password': PASSWORD,
      })

      const { res } = await agent.get('/notes/list')

      expect(res.text).contains('All notes')
      expect(res.text).not.contains('Login') //
    })
    it('When register with long username get an error', async () => {
      // ...
    })
    it('When register with short password get an error', async () => {
      // ...
    })
    it('When register with normal username/password, get a success', async () => {
      // ...
    })
  })

  describe('Notes', async () => {
    it('Get success when create new note with 1000 chars', async () => {
      // ...
    })

    it('Get success when create new note and share', async () => {
      // ...
    })

    it('Get success when share and unshare', async () => {
      // ...
    })

    it('Get error when create new note with 1001 chars', async () => {
      // ...
    })

    it('Get error when trying to edit deleted note', async () => {
      // ...
    })

    it('Get error when trying to share deleted note', async () => {
      // ...
    })

    it('Get error when trying to open unshared note', async () => {
      // ...
    })

    it('Get error when delete already deleted note', async () => {
      // ...
    })
  });

  })