const express = require('express');
const login = require('../../controllers/admin/login')
const register = require('../../controllers/admin/register')

const router = express.Router()

router.get('/login', login)
router.get('/register', register)

module.exports = router