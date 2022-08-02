const express = require('express')
const morgan = require('morgan')
const Person = require('./models/Person')

morgan.token('body', (req, res) => {
  const person = req.body
  delete person.id 
  return JSON.stringify(person)
})

const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(morganFormat, {
  skip: (req, res) => req.method.toUpperCase() === 'POST'
}))
app.use(morgan(morganFormat, {
  skip: (req, res) => req.method.toUpperCase() !== 'POST'
}))

app.listen(PORT)

app.get('/info', (request, response) => 
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>`
      )
    })  
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => 
    response.json(persons)
  )
})

app.get('/api/persons/:id', (request, response, next) => {  
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  Person.findOne({name: body.name})
    .then(person => {
      console.log("PERSON", person)
      if (person) {
        response
          .status(409)
          .json({error: `Name must be unique. ${body.name}\ 
                        is already in the phonebook`})
      }
      else {
        const newPerson = new Person({
          name: body.name,
          number: body.number,
          date: new Date(),
        })
      
        newPerson.save()
        .then(savedPerson => {
          response.status(201).json(savedPerson)
        })
        .catch(error => {
          next(error)
        })
      }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.status(200).json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
})

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response
          .status(400)
          .send({error: 'Malformed id'})
  }

  if (error.name === 'ValidationError') {
    return response
          .status(400)
          .json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)











