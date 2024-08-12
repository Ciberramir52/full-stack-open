const express = require('express');
const app = express();
const morgan = require('morgan')
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
];

morgan.token('body', req => {
    return JSON.stringify(req.body)
});

function morganForPostRequests(req, res, next) {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next); // Aquí puedes usar cualquier formato de Morgan, como 'combined'
    } else {
        morgan('tiny')(req, res, next);
    }
    next();
}

app.use(express.json());
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(morganForPostRequests);

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    console.log(person);
    if (!person) return res.sendStatus(404);
    return res.json(person);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.sendStatus(204);
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person || person.name === '' || person.number === '') return res.status(400).json({
        error: 'content missing'
    });
    const checkPerson = persons.find(element => element.name === person.name);
    if (checkPerson) return res.status(400).json({
        error: 'name must be unique'
    });
    const id = Math.floor(Math.random() * 5000);
    const result = { id, ...person };
    persons = persons.concat(result)
    res.json(result);
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length}</p>
        <p>${new Date()}</p>
    `);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})