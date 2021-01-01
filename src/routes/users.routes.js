const router = require('express').Router()
const controller = require('../controllers/users.controller')
const midd = require('../middleware/index')

router.get('/all', [midd.jwt.tokenRequired, midd.jwt.tokenAdmin], controller.all)
router.post('/edit/:id', [midd.jwt.tokenRequired, midd.jwt.sameUser], controller.edit)

module.exports = router
