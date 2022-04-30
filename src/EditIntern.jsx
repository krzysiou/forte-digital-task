import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import Joi from 'joi'
import axios from 'axios'

// convert format from the one used in database to local time
function isoStringToLocalDate(isoString){
  const pad = (number) => number >= 10 ? `${number}` : `0${number}`
  const date = new Date(isoString.replace('+', ':00.0'))
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// convert format from local to the one used in database
function localDateToISOString(localDate){
  const [year, month, day] = localDate.split('-')
  const date = new Date(year, month - 1, day)
  return date.toISOString().replace(':00.0', '+')
}

// validate input data
function validateInputs(intern){
  const schema = Joi.object({
    id: Joi.required(),
    name: Joi.string().required().messages({
      'string.empty': 'name This field is required',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.empty': 'email This field is required',
      'string.email': 'email The email is not correct'
    }),
    internshipStart: Joi.date().required().messages({
      'date.base': 'internshipStart This field is required'
    }),
    internshipEnd: Joi.date().greater(Joi.ref('internshipStart')).required().messages({
      'date.base': 'internshipEnd This field is required',
      'date.greater': 'internshipEnd This date is not correct'
    })
  })
  return schema.validate(intern, { abortEarly: false })
}

// set ocurring errors
function handleError(error, setNameError, setEmailError, setInternshipStartError, setInternshipEndError){
  const errorArray = error.split('. ')
  for(const errorMessage of errorArray){
    const key = errorMessage.split(' ')[0]
    const spaceIndex = errorMessage.indexOf(' ')
    const message = errorMessage.substring(spaceIndex + 1)

    switch(key){
    case 'name':
      setNameError(message)
      break
    case 'email':
      setEmailError(message)
      break
    case 'internshipStart':
      setInternshipStartError(message)
      break
    case 'internshipEnd':
      setInternshipEndError(message)
      break
    default:
      break
    }
  }
}

// set errors to undefined
function clearErrors(setNameError, setEmailError, setInternshipStartError, setInternshipEndError){
  setNameError()
  setEmailError()
  setInternshipStartError()
  setInternshipEndError()
}

// EditIntern component
const EditIntern = () => {

  // id parameter
  const { id } = useParams()

  // state of intern
  const [intern, setIntern] = useState({name: '', email: '', internshipStart: '', internshipEnd: ''})

  // state of errors
  const [nameError, setNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [internshipStartError, setInternshipStartError] = useState()
  const [internshipEndError, setInternshipEndError] = useState()

  useEffect(() => {
    const fetchInterns = async () => {
      axios.get(`http://localhost:3001/interns/${id}`)
        .then(response => {
          const intern = response.data
          setIntern(intern)
          setIntern(intern => ({
            ...intern,
            internshipStart: isoStringToLocalDate(intern.internshipStart),
            internshipEnd: isoStringToLocalDate(intern.internshipEnd)
          })) 
        })
        .catch(error => {
          console.log(error)
        })
    }
    fetchInterns()
  }, [id])

  // on submit check validation, if valid send request, if not valid handle errors
  const handleSubmit = (event) => {
    event.preventDefault()
    const { error } = validateInputs(intern)
    if(error){
      handleError(error.message, setNameError, setEmailError, setInternshipStartError, setInternshipEndError)
    } else {
      axios.put(`http://localhost:3001/interns/${id}`, {
        ...intern,
        internshipStart: localDateToISOString(intern.internshipStart),
        internshipEnd: localDateToISOString(intern.internshipEnd)
      })
        .then(response => {
          clearErrors(setNameError, setEmailError, setInternshipStartError, setInternshipEndError)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  // update name field of intern state
  const changeName = (e) => {
    setIntern(intern => ({...intern, name: e.target.value}) )
  }

  // update email field of intern state
  const changeEmail = (e) => {
    setIntern(intern => ({...intern, email: e.target.value}) )
  }

  // update internshipStart field of intern state
  const changeInternshipStart = (e) => {
    setIntern(intern => ({...intern, internshipStart: e.target.value}) )
  }

  // update internshipEnd field of intern state
  const changeInternshipEnd = (e) => {
    setIntern(intern => ({...intern, internshipEnd: e.target.value}) )
  }

  return (
    <div>
      <NavLink to="/">Back to list</NavLink>
      <form onSubmit={handleSubmit}>
        <label>Full name</label>
        <input type="text" name="name" value={intern.name} onChange={changeName} />
        {nameError && <p>{nameError}</p>}           
        <label>Email address</label>
        <input type="text" name="email" value={intern.email} onChange={changeEmail} />
        {emailError && <p>{emailError}</p>}  
        <label>Internship start</label>
        <input type="date" name="internshipStart" value={intern.internshipStart} onChange={changeInternshipStart} />
        {internshipStartError && <p>{internshipStartError}</p>}  
        <label>Internship end</label>
        <input type="date" name="internshipEnd" value={intern.internshipEnd} onChange={changeInternshipEnd}/>
        {internshipEndError && <p>{internshipEndError}</p>}  
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default EditIntern