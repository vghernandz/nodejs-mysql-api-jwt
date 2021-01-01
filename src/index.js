const express = require('express')
const morgan = require('morgan')

const app = express()

app.set('port', process.env.PORT || 7000)

app.use(morgan('dev'))
app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))
app.use('/users', require('./routes/users.routes'))

app.listen(app.get('port'), () =>
  console.log(`http://localhost:${app.get('port')}`)
)
