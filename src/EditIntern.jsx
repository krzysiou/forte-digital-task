import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import Joi from 'joi';
import axios from 'axios';

const EditIntern = () => {

    // id parameter
    const { id } = useParams();

    // state of intern
    const [intern, setIntern] = useState({name: '', email: '', internshipStart: '', internshipEnd: ''});

    // state of errors
    const [nameError, setNameError] = useState();
    const [emailError, setEmailError] = useState();
    const [internshipStartError, setInternshipStartError] = useState();
    const [internshipEndError, setInternshipEndError] = useState();

    // validate input data
    const validateInputs = () => {
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
        return schema.validate(intern, { abortEarly: false });
    }

    // set errors to undefined
    const clearErrors = () => {
        setNameError();
        setEmailError();
        setInternshipStartError();
        setInternshipEndError();
    }

    // set ocurring errors
    const handleError = (error) => {
        const errorArray = error.split('. ');
        for(const errorMessage of errorArray){
            const key = errorMessage.split(' ')[0];
            const spaceIndex = errorMessage.indexOf(' ');
            const message = errorMessage.substring(spaceIndex + 1);

            switch(key){
                case 'name':
                    setNameError(message);
                    break;
                case 'email':
                    setEmailError(message);
                    break;
                case 'internshipStart':
                    setInternshipStartError(message);
                    break;
                case 'internshipEnd':
                    setInternshipEndError(message);
                    break;
                default:
                    break;
            }
        }
    }

    // on submit check validation, if valid send request, if not valid handle errors
    const handleSubmit = (event) => {
        event.preventDefault();
        const { error } = validateInputs()
        if(error){
            handleError(error.message)
        } else {
            axios.put(`http://localhost:3001/interns/${id}`, intern)
            .then(response => {
                clearErrors();
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    // on change update intern state
    const handleChange = (event) => {
        const nameKey = event.target.name;
        const nameValue = event.target.value;
        setIntern(values => ({...values, [nameKey]: nameValue})) 
    }

    useEffect(() => {
        const fetchInterns = async () => {
            axios.get(`http://localhost:3001/interns/${id}`)
            .then(response => {
                const intern = response.data;
                setIntern(intern);
                //scuffed
                setIntern(values => ({...values,
                    internshipStart: intern.internshipStart.split('T')[0],
                    internshipEnd: intern.internshipEnd.split('T')[0]}));
            })
            .catch(error => {
                console.log(error);
            })
        }
        fetchInterns();
    }, [id]);

    return (
        <div>
            <NavLink to="/">Back to list</NavLink>
            <form onSubmit={handleSubmit}>
                <label>Full name</label>
                <input type="text" name="name" value={intern.name} onChange={handleChange} />
                {nameError && <p>{nameError}</p>}           
                <label>Email address</label>
                <input type="text" name="email" value={intern.email} onChange={handleChange} />
                {emailError && <p>{emailError}</p>}  
                <label>Internship start</label>
                <input type="date" name="internshipStart" value={intern.internshipStart.split('T')[0]} onChange={handleChange} />
                {internshipStartError && <p>{internshipStartError}</p>}  
                <label>Internship end</label>
                <input type="date" name="internshipEnd" value={intern.internshipEnd.split('T')[0]} onChange={handleChange} />
                {internshipEndError && <p>{internshipEndError}</p>}  
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default EditIntern;