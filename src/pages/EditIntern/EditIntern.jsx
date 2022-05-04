import './EditIntern.css'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import Joi from 'joi'
import axios from 'axios'

import logoIcon from '../../assets/logo.svg'
import arrowIcon from '../../assets/leftArrow.svg'
import errorIcon from '../../assets/error.svg'

/**
 * Convert iso string to yyyy-mm-dd date format.
 * @param isoString iso string holding date data
 * @returns date in yyyy-mm-dd format
 */
function isoStringToLocalDate(isoString){
  const pad = (number) => number >= 10 ? `${number}` : `0${number}`
  const date = new Date(isoString.replace('+', ':00.0'))
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Convert yyyy-mm-dd date format to iso string.
 * @param localDate date in yyyy-mm-dd format
 * @returns date as iso string
 */
function localDateToISOString(localDate){
  const [year, month, day] = localDate.split('-')
  const date = new Date(year, month - 1, day)
  return date.toISOString().replace(':00.0', '+')
}

/**
 * Validates intern objects with described ruleset.
 * @param intern object representing an intern that needs validation
 * @returns an object describing validation result
 */
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

const EditIntern = () => {

  const { id } = useParams()

  const [intern, setIntern] = useState({name: '', email: '', internshipStart: '', internshipEnd: ''})

  const [nameError, setNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [internshipStartError, setInternshipStartError] = useState()
  const [internshipEndError, setInternshipEndError] = useState()

  useEffect(() => {
    /**
     * Fetch intern data from server, format included dates and save it in intern state.
     */
    const fetchIntern = async () => {
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
    fetchIntern()
  }, [id])

  /**
   * Handle validation error by setting according errors.
   * @param error error message returned when validation with Joi fails.
   */
  const handleError = (error) => {
    const errorArray = error.split('. ')
    const keyArray = []

    for(const errorMessage of errorArray){
      const key = errorMessage.split(' ')[0]
      keyArray.push(key)
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

    if(!keyArray.includes('name')){
      setNameError()
    }

    if(!keyArray.includes('email')){
      setEmailError()
    }

    if(!keyArray.includes('internshipStart')){
      setInternshipStartError()
    }

    if(!keyArray.includes('internshipEnd')){
      setInternshipEndError()
    }
  }

  /**
   * Handle submit by validating gathered inputs. If validation passes send PUT request with formatted date values to update database.
   * If validation fails handle error. After successful request clear all errors.
   * @param event event occurring when form is submitted
   */
  const handleSubmit = (event) => {
    event.preventDefault()
    const { error } = validateInputs(intern)
    if(error){
      handleError(error.message)
    } else {
      axios.put(`http://localhost:3001/interns/${id}`, {
        ...intern,
        internshipStart: localDateToISOString(intern.internshipStart),
        internshipEnd: localDateToISOString(intern.internshipEnd)
      })
        .then(response => {
          setNameError()
          setEmailError()
          setInternshipStartError()
          setInternshipEndError()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  /**
   * Change intern name based on input.
   * @param e event when input changes
   */
  const changeName = (e) => {
    setIntern(intern => ({...intern, name: e.target.value}) )
  }

  /**
   * Change intern email based on input.
   * @param e event when input changes
   */
  const changeEmail = (e) => {
    setIntern(intern => ({...intern, email: e.target.value}) )
  }

  /**
   * Change internship start date based on input.
   * @param e event when input changes
   */
  const changeInternshipStart = (e) => {
    setIntern(intern => ({...intern, internshipStart: e.target.value}) )
  }

  /**
   * Change internship end date based on input.
   * @param e event when input changes
   */
  const changeInternshipEnd = (e) => {
    setIntern(intern => ({...intern, internshipEnd: e.target.value}) )
  }

  return (
    <div>
      <img src={logoIcon} alt="company logo icon" className='logo-icon'/>
      <div className='back-button-container'>
        <NavLink to="/" className='back-button'>
          <img src={arrowIcon} alt="back button icon" className='back-button-icon'/>
          <p className='back-button-label'>Back to list</p>
        </NavLink>
      </div>
      <div className='container'>
        <h1 className='container-label'>Edit</h1>
        <form onSubmit={handleSubmit} className='form'>
          <div className='form-input-container'>
            <label htmlFor='name' className='form-input-label'>Full name *</label>
            <input id='name' type="text" name="name" value={intern.name} placeholder='name' onChange={changeName} className='form-input-field' style={{boxShadow: nameError ? '0 0 0 2px #A3270C' : ''}}/>
            {nameError && <img src={errorIcon} alt="name error" className='error-icon'/>}
            {nameError && <p className='error-message'>{nameError}</p>}           
          </div>
          <div className='form-input-container'>
            <label htmlFor='email' className='form-input-label'>Email address *</label>
            <input id='email' type="text" name="email" value={intern.email} placeholder='email' onChange={changeEmail} className='form-input-field' style={{boxShadow: emailError ? '0 0 0 2px #A3270C' : ''}}/>
            {emailError && <img src={errorIcon} alt="email error" className='error-icon'/>}
            {emailError && <p className='error-message'>{emailError}</p>}  
          </div>
          <div className='form-date-outer-container'>
            <div className='form-date-inner-container'>
              <label htmlFor='internshipStart' className='form-input-label'>Internship start *</label>
              <input id='internshipStart' type="date" name="internshipStart" value={intern.internshipStart} onChange={changeInternshipStart} className='form-input-field form-date-input-field' style={{color : intern.internshipStart ? '#222222' : '#555555', boxShadow: internshipStartError ? '0 0 0 2px #A3270C' : ''}}/>
              {internshipStartError && <img src={errorIcon} alt="internship start error" className='form-date-error-icon'/>}
              {internshipStartError && <p className='error-message'>{internshipStartError}</p>}  
            </div>
            <div className='form-date-inner-container'>
              <label htmlFor='internshipEnd' className='form-input-label'>Internship end *</label>
              <input id='internshipEnd' type="date" name="internshipEnd" value={intern.internshipEnd} onChange={changeInternshipEnd} className='form-input-field form-date-input-field' style={{color : intern.internshipEnd ? '#222222' : '#555555', boxShadow: internshipEndError ? '0 0 0 2px #A3270C' : ''}}/>
              {internshipEndError && <img src={errorIcon} alt="internship end error" className='form-date-error-icon'/>}
              {internshipEndError && <p className='error-message'>{internshipEndError}</p>}  
            </div>
          </div>
          <div className='form-button-container'>
            <input type="submit" value="Submit" className='form-submit'/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditIntern