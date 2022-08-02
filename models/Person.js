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
    required: [true, 'Name is required'],
    minLength: [3, 'Name must be at least 3 characters long']
  }, 
  "number": {
    type: String, 
    required: [true, 'Number is required'],
    minLength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: value => {
        console.log("VALIDATING...")
        return value.match('^[0-9]{2,3}[-]?[0-9]+(?<=.{8,})$')
      },
      message: "Phone number characters can only be separated by a single " + 
                "hyphen (-), after the 2nd or 3rd character"
    }
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