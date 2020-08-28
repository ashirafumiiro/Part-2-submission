import React, { useState, useEffect } from 'react';
import personsService from './services/persons'

const Filter = (props)=>{
  return (
    <div style={{height: 50}}>filter show with 
        <input value={props.filter} onChange={props.filterChange}/>
      </div>
  );
}

const PersonForm = (props)=>{
  return(
    <form onSubmit={props.handleSubmit}>
    <div>
      name: <input value={props.newName} onChange={props.nameChange}/>
    </div>
    <div>number: <input value={props.phoneNumber} onChange={props.phoneNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({persons, filter, deletePerson})=>{
  return (
    <div>
      {persons.filter(p=>p.name.toLowerCase().includes(filter))
        .map(person=><div  key={person.name}>{person.name} {person.number} 
        <button onClick={()=>deletePerson(person)}>delete</button></div>)}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ filter, setFilter ] = useState('');

  useEffect(()=>{
    personsService
    .getAll()
    .then(initialPersons=>{
      setPersons(initialPersons);
    })
    .catch((err)=>console.log(err))
  }, []);

  const deletePerson = (person)=>{
      if (window.confirm(`Delete ${person.name}?`)) {
        personsService
          .deletePerson(person.id)
          .then(()=>{
            setPersons(persons.filter(p=>p.id !== person.id))
          })
          .catch(()=>{
            alert("Person does not exist")
          })
      }
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    if(persons.findIndex(p=>p.name === newName) > -1){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const personToUpdate = persons.find(p=>p.name===newName);
          personsService
            .update(personToUpdate.id, { ...personToUpdate, number: phoneNumber})
            .then((returnedPerson)=>{
              setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
            })
            .catch(()=>{
              alert("Failed to update")
            });
      }
    } 
    else{
      const person = {name: newName, number: phoneNumber};
      personsService
        .create(person)
        .then(newPerson=>{
          setPersons(persons.concat(newPerson));
        });
      setNewName('');
      setPhoneNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} filterChange={(e)=>setFilter(e.target.value)}/>
      
      <PersonForm
        handleSubmit={handleSubmit} 
        newName={newName} 
        nameChange={(e)=>setNewName(e.target.value)}
        phoneNumber={phoneNumber} 
        phoneNumberChange={(event)=>setPhoneNumber(event.target.value)}
        />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )
}

export default App