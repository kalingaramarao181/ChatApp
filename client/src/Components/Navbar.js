import React from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  return (
<>
<div>

<ul className='Navbar-container'>
<Link to='/'><li className='navbar-elements'>Home</li></Link>
<Link to='/Login'><li  className='navbar-elements'>Login</li></Link>
<Link to='/Signin'><li  className='navbar-elements'>Signin</li></Link> 
</ul>

</div>
</> 
 )
}

export default Navbar