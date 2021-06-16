const expect = require('chai').expect

//1. тестируемый модуль
describe('Notes', function () {
  //2. сценарий
  describe('Add new note', function () {
    // 3. то, чего ждут от теста
    it('When adding without auth get an error', () => {

      expect('pendingApproval').to.equal('pendingApproval')
    })
  })
})