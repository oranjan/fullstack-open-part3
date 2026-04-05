const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI


// console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
    .then(() => console.log('connected to mongodb'))
    .catch((error) => console.log(error.message, 'error connecting to mongodb'))

const phoneBookSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength:3,
        required:true
    },
    phoneNumber: {
        type:String,
        minLength:8,
        required:true,
    },
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const person = mongoose.model('person', phoneBookSchema)
module.exports = person