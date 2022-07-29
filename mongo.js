const mongoose = require('mongoose')

const args = process.argv

if  (args.length < 3 || 
    (args.length > 3 && args.length < 5)) {
  console.log('\nUSAGE:')
  console.log('mongo.js <password> => query-all')
  console.log('mongo.js <password> person-name phone-number => create-person')
  process.exit(1)
}

const url = 
`mongodb+srv://admin:${args[2]}@cluster0.9mfcr.mongodb.net/phonebook?retryWrites=true&w=majority`

const Person = mongoose.model('Person', new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
  id: Number
}))

if (args.length === 3) {
  // query all
  mongoose
    .connect(url)
    .then(result => {
      console.log('Connected...')  
      Person.find({}).then(result => {
        result.forEach(person => console.log(person))
        mongoose.connection.close()
      })
    })
}
else {
  // create person
  const newPerson = new Person({
    name: args[3],
    number: args[4],
    date: new Date()
  })

  mongoose
    .connect(url)
    .then(result => 
      newPerson.save()
        .then(result => 
          mongoose.connection.close()))
}

  