const { request, response } = require('express')
const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

app.listen(PORT)

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) =>
  response.send('Hello World'))

app.get('/info', (request, response) => 
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  ))

app.get('/api/persons', (request, response) =>
  response.json(persons))

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

  if (notUnique(person.name)) {
    return response
            .status(409)
            .json({error: `Name must be unique. ${person.name} already exists`})
  }

  person.id = generateId()
  persons = persons.concat(person)
  response.status(201).json(person)
})

const notUnique = (name) =>
  persons.find(person => person.name === name)

const generateId = () =>
  Math.floor(Math.random() * 10000);

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)
  response.status(204, 'Delete success').end()
})