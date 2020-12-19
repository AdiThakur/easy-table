'use strict'

const express = require('express')
const path = require('path');
const app = express()

// Static Directory: Any get requests are handled here first.
app.use(express.static(path.join(__dirname, '/pub')))

app.get('/GettingStarted', (req, res) => {
    res.sendFile(path.join(__dirname, '/pub/getting-started.html'))
})

app.get('/Docs', (req, res) => {
    res.sendFile(path.join(__dirname, '/pub/docs.html'))
})

app.get('/Examples', (req, res) => {
    res.sendFile(path.join(__dirname, '/pub/examples.html'))
})


app.get('*', (req, res) => {

    const routes = ["/", "/Home"]
    if (!routes.includes(req.url)) {
        res.status(404).send("Whoops! No such page found. Redirecting....")
        return
    }
    res.redirect('/GettingStarted')
})

const LOCAL_PORT = 5000
const port = process.env.PORT || LOCAL_PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})