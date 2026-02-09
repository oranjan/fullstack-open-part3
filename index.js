const express = require("express")
const morgan = require("morgan")

const app = express()
app.use(express.json())
app.use(express.static('dist'))


morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let phonebookData = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/info", (req, res) => {
    const date = new Date().toString();
    res.send(`<p>Phonebook has info for ${phonebookData.length} people</p>
    <p>${date} </p>`)
})

app.get("/api/persons", (req, res) => {
    res.json(phonebookData)
})

app.get(`/api/persons/:id`, (req, res) => {
    const id = req.params.id
    const requiredEntry = phonebookData.find(p => p.id === id)
    if (requiredEntry) {
        res.json(requiredEntry)
    }
    else {
        res.status(404).json({ error: "phonebook doesn't have this entry" })
    }
})

app.delete(`/api/persons/:id`, (req, res) => {
    const id = req.params.id
    const idExists = phonebookData.find(p => p.id === id)

    if (idExists) {
        phonebookData = phonebookData.filter(p => p.id !== id)
        res.status(204).end()
    }
    else {
        res.status(404).json({
            error: "phonebook doesn't have this entry"
        })
    }
})

app.post(`/api/persons`, (req, res) => {
    const { name, phoneNumber } = req.body
    if (!name || !phoneNumber) {
        return res.status(400).json({ error: "name or phoneNumber is missing" })
    }

    if (phonebookData.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({
            error: "The name already exists in the phonebook"
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 1000000)),
        "name": name,
        "phoneNumber": phoneNumber
    }

    phonebookData = phonebookData.concat(person)
    res.status(201).json(person)
})

app.listen(3001, () => {
    console.log("we listening at 3001")
})
