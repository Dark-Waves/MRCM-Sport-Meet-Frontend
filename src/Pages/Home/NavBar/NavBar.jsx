import React from 'react'

export default function NavBar() {
  return (
    <div className='w-full flex-row-bet'>
        <div className="logo">
            <img src="/sportmeetlogo.png" alt="sportmeetlogo" />
        </div>
        <div className="nav-items flex-row">
            <a href="#home"><p>Home</p></a>
            <a href="#aboutus"><p>About Us</p></a>
            <a href="#contactus"><p>Contact Us</p></a>            
        </div>
    </div>
  )
}
