const pool = require('../database')

const all = async (req, res) => {
  let roles

  try {
    roles = await pool.query('SELECT * FROM roles')
  } catch (error) {
    res.status(400).json(error)
  }

  try {
    const users = await pool.query(
      'SELECT id, id_role, name, lastname, email, country, phone, created_at, updated_at FROM users'
    )

    users.forEach(({ id_role }, i) => {
      users[i].role = roles.filter(({ id }) => id === id_role)[0].role
      delete users[i].id_role
    })

    return res.status(200).json({ users })
  } catch (error) {
    res.status(400).json(error)
  }
}

const edit = async (req, res) => {
  const { user } = req.body
  const { id } = req.params

  try {
    await pool.query('UPDATE users SET ? WHERE id =?', [user, id])

    res.status(200).json({ message: 'user edit successfully' })
  } catch (error) {
    res.status(400).json(error)
  }
}

module.exports = { all, edit }
