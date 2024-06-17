const express = require("express");
const morgan = require('morgan');
const cors = require('cors')

const app = express();

app.use(express.static('dist'))
app.use(cors())
app.use(express.json());

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
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});


const customFormat = ':method :url :status :res[content-length] - :response-time ms :body';

app.use(morgan(customFormat));
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);

    } else {
        res.status(400).end();
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const person = req.body;

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }

    if (persons.some(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'name alredy added'
        });
    }

    // Genera un nuevo ID utilizando Math.random
    person.id = (Math.floor(Math.random() * 1000000)).toString();

    persons.push(person);
    res.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
