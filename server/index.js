require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const app = express()

const {SESSION_SECRET, SERVER_PORT, CONNECTION_STRING} = process.env
const auth = require('./controllers/controller')

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: 1000 * 60 * 60 * 24,
    secret: SESSION_SECRET
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then(db => {
    app.set('db', db)
    console.log('connected to db')
}).catch(err => console.log(err))

app.post('/auth/login', auth.login)
app.post('/auth/register', auth.register)
app.get('/auth/logout', auth.logout)
app.get('/auth/user', auth.getUser)


app.listen(SERVER_PORT, () => console.log(`server listening on port ${SERVER_PORT}`))

