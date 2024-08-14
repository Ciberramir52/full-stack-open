require('dotenv').config();
const express = require('express');
const Person = require('./models/persons');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

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

app.get('/info', (req, res, next) => {
    Person.find({}).then(result => {
        res.send(`
            <p>Phonebook has info for ${result.length} persons</p>
            <p>${new Date()}</p>
        `);
    }).catch(error => next(error));
});

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(result => {
        res.json(result);
    }).catch(error => next(error))
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
                res.status(404).end();
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
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    console.log(body);
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    Person.find({ name: body.name })
        .then(result => {
            if (result) return res.status(400).json({
                error: 'name must be unique'
            });
            const uploadPerson = new Person(body);
            uploadPerson.save().then(resultUpload => {
                // console.log('Person saved!', result)
                // mongoose.connection.close()
                res.json(resultUpload);
            }).catch(error => next(error));
        }).catch(error => next(error));
    // const id = Math.floor(Math.random() * 5000);
    // const result = { id, ...person };
    // localPersons = localPersons.concat(result)
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = { ...body }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

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

    next(error);
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});