require('dotenv').config()
const express = require("express")
const morgan = require("morgan")

const app = express()
app.use(express.json())
app.use(express.static('dist'))

const Person = require('./models/person.js')

morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))



// app.get("/info", (req, res) => {
//     const date = new Date().toString();
//     res.send(`<p>Phonebook has info for ${phonebookData.length} people</p>
//     <p>${date} </p>`)
// })

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then((people) => {
        if (people) res.json(people)
        else res.status(404).end()
    }).catch(err => next(err))
})

app.get(`/api/persons/:id`, (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        }
        else {
            res.status(404).end()
        }
    })
        .catch(err => {
            next(err)
        })
})

app.delete(`/api/persons/:id`, (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).
        then(() => res.status(204).end())
        .catch(err => next(err))
})

app.post(`/api/persons`, (req, res, next) => {
    const { name, phoneNumber } = req.body
    if (!name || !phoneNumber) {
        return res.status(400).json({ error: "name or phoneNumber is missing" })
    }

    const newPerson = new Person({
        "name": name,
        "phoneNumber": phoneNumber
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { phoneNumber } = req.body
    if (!phoneNumber) return res.status(400).json({ error: "Phone number was not present" })

    Person.findByIdAndUpdate(
        req.params.id,
        {
            phoneNumber
        },
        {
            new: true
        }
    ).then(updatedPerson => {
        if (updatedPerson) return res.json(updatedPerson)
        else res.status(404).end()
    })
        .catch(err => next(err))

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: "malformed id" })
    }

    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }


    // 500 status code express defualt error handler 
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(3001, () => {
    console.log("we listening at 3001")
})
