const pool = require('../database')

const existEmail = async (req, res, next) => {
  const { email } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = ?', [
      email
    ])

    if (user.length) {
      return res.status(400).json({ error: 'email already registered' })
    }

    next()
  } catch (error) {
    return res.status(400).json({ error })
  }
}

const existRole = async (req, res, next) => {
  const { role: queryRole } = req.body

  if (!queryRole) {
    return next()
  }

  try {
    const roles = await pool.query('SELECT * FROM roles')
    const exist = roles.filter(({ role }) => role === queryRole).length

    if (exist) {
      return next()
    }

    return res.status(400).json({ error: 'role not valid' })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = { existEmail, existRole }
