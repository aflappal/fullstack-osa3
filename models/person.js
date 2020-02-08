const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log('connected to mongodb');
    })
    .catch(error => {
        console.log('error connecting to mongodb:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, retObj) => {
        retObj.id = retObj._id.toString();
        delete retObj._id;
        delete retObj.__v;
    }
});

function printAll() {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(printOne);
        mongoose.connection.close();
    });
}

function printOne(person) {
    console.log(`${person.name} ${person.number}`);
}

function add(name, number) {
    const person = new Person({ name, number });

    person.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`);
        mongoose.connection.close();
    });
}

module.exports = mongoose.model('Person', personSchema);
