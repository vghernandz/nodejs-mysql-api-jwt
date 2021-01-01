const jwt = require('jsonwebtoken')
const pool = require('../database')
const { isAdmin } = require('../helpers/functions')

const tokenRequired = async (req, res, next) => {
  const token = req.headers['private-access-token']

  if (!token) {
    return res.status(400).json({ error: 'token required' })
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_KEY)
    req.id_user = id

    const exist = await pool.query('SELECT * FROM users WHERE id = ?', [id])

    if (!exist.length) {
      return res.status(400).json({ error: 'token unassigned' })
    }

    return next()
  } catch (error) {
    return res.status(400).json({ error: 'token not valid' })
  }
}

const tokenAdmin = async (req, res, next) => {
  try {
    const admin = await isAdmin(req.id_user)

    if (!admin) {
      return res.status(400).json({ error: 'token requires admin permissions' })
    }

    return next()
  } catch (error) {
    res.status(400).json(error)
  }
}

const sameUser = async (req, res, next) => {
  const id = Number(req.params.id)

  try {
    const admin = await isAdmin(req.id_user)

    if (req.id_user === id || admin) {
      return next()
    }

    return res.status(400).json({ error: 'You do not have permissions to manage documents that are not owned by you' })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = { tokenRequired, tokenAdmin, sameUser }
