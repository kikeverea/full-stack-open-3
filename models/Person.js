require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.PERSONS_DB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  "id": String,
  "name": {
    type: String, 
    required: true,
    minLength: 3
  }, 
  "number": {
    type: String,
    required: true    
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)