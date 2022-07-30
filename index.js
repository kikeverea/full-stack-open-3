const express = require('express')
const morgan = require('morgan')
const Person = require('./models/Person')

morgan.token('body', (req, res) => {
  const person = req.body
  delete person.id 
  return JSON.stringify(person)
})

const app = express()
const PORT = process.env.PORT || 3001
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(morganFormat, {
  skip: (req, res) => req.method.toUpperCase() === 'POST'
}))
app.use(morgan(morganFormat, {
  skip: (req, res) => req.method.toUpperCase() !== 'POST'
}))

app.listen(PORT)

app.get('/info', (request, response) => 
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  ))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => 
    response.json(persons)
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id);
  
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if(!person.name || !person.number) {
    return response
            .status(400)
            .json({error: "Both 'name' and 'number' must be provided"})
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
    date: new Date(),
  })

  newPerson.save()
  .then(savedPerson => {
    response.status(201).json(savedPerson)
  })
  .catch(error => {
    console.log(error);
    if (error.code === 11000) {
      return response
            .status(409)
            .json({error: `Name must be unique. ${person.name} is already in the phonebook`})
    }
    else {
      return response
            .status(500)
            .json(error)
            .end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(error => {
      console.log(error)
      return response.status(500).end() 
    })
})










