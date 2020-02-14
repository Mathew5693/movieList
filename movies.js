require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIELIST = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.get('/movie', function handleAvgVote(req, res){
    let response = MOVIELIST;

    if(req.query.avg_vote){
        response = response.filter(average => average.avg_vote >= req.query.avg_vote)
    }

    if(req.query.country){
        response = response.filter(country => country.country.toLowerCase() == req.query.country.toLowerCase())
    }

    if(req.query.genre){
        response = response.filter(genre => genre.genre.toLowerCase() == req.query.genre.toLowerCase())
    }


    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`server on port ${PORT}`)
})