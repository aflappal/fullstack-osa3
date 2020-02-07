const express = require('express');
const app = express();

app.use(express.json());

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
    res.json(records);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const persons = records.find(p => p.id === id);
    
    if (persons)
        res.json(persons);
    else
        res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    records = records.filter(p => p.id !== id);

    res.status(204).end();
});

const genId = () => Math.floor(Math.random() * 1000);

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

    const record = {
        name: body.name,
        number: body.number,
        id: genId()
    };

    records = records.concat(record);
    console.log('Added record', record);

    res.json(record);
});

app.get('/info', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    return res.end(`Phonebook has info for ${records.length} people\n`
        + new Date());
});

const PORT = 3001;
app.listen(PORT, () => console.log(`app listening on ${PORT}`));
