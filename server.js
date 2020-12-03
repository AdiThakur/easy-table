'use strict'

const express = require('express')
const path = require('path');
const app = express()

// Static Directory: Any get requests are handled here first.
app.use(express.static(path.join(__dirname, '/pub')))

const LOCAL_PORT = 5000
const port = process.env.PORT || LOCAL_PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})