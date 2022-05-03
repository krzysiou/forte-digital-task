import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import logoIcon from './logo.svg'
import editIcon from './edit.svg'
import './InternList.css'

const InternList = () => {

  const [interns, setInterns] = useState([])

  useEffect(() => {
    const fetchInterns = async () => {
      const response = await fetch('http://localhost:3001/interns')
      const interns = await response.json()
      setInterns(interns)
    }
    fetchInterns()
  }, [])

  return (
    <>
      <img src={logoIcon} alt="logo" className='logo-icon'/>
      <div className='content'>
        <p className='heading-label'>Participants</p>
        <div className='list'>
          {interns.map(u => (
            <div key={u.id} className='list-element'>
              <p className='name-label'>{u.name}</p>
              <NavLink to={`/interns/${u.id}`} className='edit' style={{textDecoration: 'none', color: '#222222'}}>
                <div className='icon'>
                  <img src={editIcon} alt="edit" className='edit-icon'/>
                </div>
                <p className='edit-label'>Edit</p>
              </NavLink>
            </div>))}
        </div>
      </div>
    </>
  )
}

export default InternList