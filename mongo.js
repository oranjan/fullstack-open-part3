const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]


const url = `mongodb+srv://admin:${encodeURIComponent(password)}@cluster0.f9bvwdb.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const phoneBookSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const person = mongoose.model('person', phoneBookSchema)


if (!name || !phoneNumber) {
    console.log('phonebook')
    person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.phoneNumber)
        })
        mongoose.connection.close()
    })

    // return
}
