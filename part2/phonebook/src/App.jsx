import { useEffect, useState } from "react"
import personService from "./services/persons";

const Part = ({ text, handleChange, value }) => {
  return (
    <div>{text}: <input onChange={handleChange} value={value} /></div>
  )
}

const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const PersonForm = ({ title, errorMessage, successfulMessage, handleSubmit, newName, newNumber, handleNewName, handleNewNumber }) => {
  return (
    <div>
      <h2>{title}</h2>
      <Notification type="successful" message={successfulMessage} />
      <Notification type="error" message={errorMessage} />
      <form onSubmit={handleSubmit}>
        <Part text='Name' handleChange={handleNewName} value={newName} />
        <Part text='Number' handleChange={handleNewNumber} value={newNumber} />
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const Numbers = ({ title, filterPerson, persons, handleDelete }) => {
  return (
    <div>
      <h2>{title}</h2>
      {
        persons.filter(person => person.name.toLowerCase().includes(filterPerson.toLowerCase())).map(person => <div key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></div>)
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);

  const [filterPerson, setFilterPerson] = useState('');

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const [successfulMessage, setSuccessfulMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onFilterChange = (e) => {
    setFilterPerson(e.target.value);
  }

  const onNameChange = (e) => {
    setNewName(e.target.value);
  }

  const onNumberChange = (e) => {
    setNewNumber(e.target.value);
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (newName === '' || newNumber === '') return alert('Please enter data');
    const checkedPerson = persons.find(person => person.name === newName);
    if (checkedPerson) {
      const confirmUpdate = confirm(`${newName} is already added to the phonebook. Do you want to update the contact?`);
      if (confirmUpdate) {
        const updatedPerson = { ...checkedPerson, name: newName, number: newNumber }
        return personService
          .update(checkedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setSuccessfulMessage(
              `Updated '${returnedPerson.name}'`
            )
            setTimeout(() => {
              setSuccessfulMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setErrorMessage(
              `Error: ${error.response.data.error}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== checkedPerson.id))
            setNewName('');
            setNewNumber('');
            console.log(error.response.data.error);            
          })
      }
    }
    personService
      .create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setSuccessfulMessage(
          `Added '${returnedPerson.name}'`
        )
        setTimeout(() => {
          setSuccessfulMessage(null)
        }, 5000)
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        setErrorMessage(
          `Error: ${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNewName('');
        setNewNumber('');
      });
  }

  const onDeletePerson = id => {
    personService
      .deletePerson(id)
      .then(() => setPersons(persons.filter(person => person.id !== id)))
      .catch(error => {
        setErrorMessage(
          `Error: ${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  console.log(persons);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        setErrorMessage(
          `Error: ${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
      })
  }, []);

  return (
    <div>
      <h1>Phonebook</h1>
      <Part text='filter shown with' handleChange={onFilterChange} value={filterPerson} />
      <PersonForm
        title='Add a new'
        handleSubmit={onFormSubmit}
        handleNewName={onNameChange}
        newName={newName}
        handleNewNumber={onNumberChange}
        successfulMessage={successfulMessage}
        errorMessage={errorMessage}
        newNumber={newNumber}
      />
      <Numbers handleDelete={onDeletePerson} title='Numbers' filterPerson={filterPerson} persons={persons} />
    </div>
  )
}

export default App;