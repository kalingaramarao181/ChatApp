import React from 'react'
import {Link} from 'react-router-dom';
import './index.css';
const Navbar = () => {
  return (
<>
<div>

<ul className='Navbar-container'>
  
<Link to='/' className='navbar-elements' ><li ><img src='images\image.png' alt='logo' className='logo-image' /> </li></Link>
<div className='navbar-list-container'>
<Link to='/' className='navbar-elements'><li >Home</li></Link>
<Link to='/Login' className='navbar-elements'><li >Login</li></Link>
<Link to='/Signin' className='navbar-elements'><li >Signin</li></Link> 
</div>

</ul>

</div>
</> 
 )
}

export default Navbar