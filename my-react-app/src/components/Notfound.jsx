import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Notfound.css'

function Notfound() {

    const navigate=useNavigate()
    function handleback(){
        navigate('/')
    }
  return (
    <div className='error'>
        <h2>404 Page Not Found</h2>
        <button onClick={handleback}>Back to Home</button>
    </div>
  )
}
export default Notfound
