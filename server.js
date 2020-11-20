'use strict'

const express = require('express')
const path = require('path');
const app = express()

// Static Directory: Any get requests are handled here first.
app.use(express.static(path.join(__dirname, '/pub')))

const PORT = 5000
const port = process.env.PORT || PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

app.get('/server.js', (req, res) => {
    // object converted to JSON string
    res.send('<h1>Snoopin around, eh?</h1>')
})
