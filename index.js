require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

// expecting req.body to be set, so have to add morgan after the json middleware
morgan.token('post-data', (req, res) => {
    if (req.method === "POST")
        return JSON.stringify(req.body);
    else
        return ''
});

const myfmt = morgan.tiny + ' :post-data';

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(myfmt));

let records = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(p => p.toJSON()));
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person.toJSON());
            else
                res.status(404).end();
        })
        .catch(error => {
            next(error);
        });
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(person => {
            res.status(204).end();
        })
        .catch(error => {
            next(error);
        });
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({error: 'name missing'});
    }
    if (!body.number) {
        return res.status(400).json({error: 'number missing'});
    }
    if (records.find(p => p.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'});
    }

    const record = new Person({
        name: body.name,
        number: body.number
    });

    record.save().then(savedRec => {
        records = records.concat(record);
        console.log('Added record', record);
        res.json(record.toJSON());
    });
});

app.get('/info', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    return res.end(`Phonebook has info for ${records.length} people\n`
        + new Date());
});

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({error: 'malformatted id'});
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`app listening on ${PORT}`));
