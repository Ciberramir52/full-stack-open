require('dotenv').config();
const express = require('express');
const Person = require('./models/persons');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

let localPersons = [
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

app.use(cors());

morgan.token('body', req => JSON.stringify(req.body));

function morganForPostRequests(req, res, next) {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next); // Aquí puedes usar cualquier formato de Morgan, como 'combined'
    } else {
        morgan('tiny')(req, res, next);
    }
}

app.use(express.static('dist'));

app.use(express.json());
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(morganForPostRequests);

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    // const person = localPersons.find(person => person.id === id);
    // console.log(person);
    // if (!person) return res.sendStatus(404);
    // return res.json(person);
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.sendStatus(404);
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    // localPersons = localPersons.filter(person => person.id !== id);
    // res.sendStatus(204);
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.sendStatus(204);
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person || person.name === '' || person.number === '') return res.status(400).json({
        error: 'content missing'
    });
    const checkPerson = localPersons.find(element => element.name === person.name);
    if (checkPerson) return res.status(400).json({
        error: 'name must be unique'
    });
    // const id = Math.floor(Math.random() * 5000);
    // const result = { id, ...person };
    const uploadPerson = new Person(person);
    // localPersons = localPersons.concat(result)
    uploadPerson.save().then(result => {
        // console.log('Person saved!', result)
        // mongoose.connection.close()
        res.json(result);
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`
            <p>Phonebook has info for ${result.length}</p>
            <p>${new Date()}</p>
        `);
    })
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});