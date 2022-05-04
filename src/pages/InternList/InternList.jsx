import './InternList.css'

import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import logoIcon from '../../assets/logo.svg'
import editIcon from '../../assets/edit.svg'

const InternList = () => {

  const [interns, setInterns] = useState([])

  useEffect(() => {
    /**
     * Fetch interns array from server and save it in an interns state.
     */
    const fetchInterns = async () => {
      const response = await fetch('http://localhost:3001/interns')
      const interns = await response.json()
      setInterns(interns)
    }
    fetchInterns()
  }, [])

  /**
   * Map interns array to jsx elements that display intern name and button to edit intern data.
   * @returns array of jsx elements
   */
  const internList = () => {
    return interns.map(intern => (
      <div key={intern.id} className='intern-list-element'>
        <p className='intern-name-label'>{intern.name}</p>
        <NavLink to={`/interns/${intern.id}`} className='edit-button'>
          <img src={editIcon} alt="edit button" className='edit-button-icon'/>
          <p className='edit-button-label'>Edit</p>
        </NavLink>
      </div>))
  }

  return (
    <div>
      <img src={logoIcon} alt="logo" className='logo-icon'/>
      <div className='outer-container'>
        <h1 className='outer-container-label'>Participants</h1>
        <div className='intern-list-container'>
          {internList()}
        </div>
      </div>
    </div>
  )
}

export default InternList