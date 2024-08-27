import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login'
import Signup from './Components/Signup'
import Navbar from './Components/Navbar';
import Secure from './Components/Secure';
import Dashboard from './Components/Dashboard';
import Swipe from './Components/Swipe';
import AdminSecure from './Components/AdminSecure';
import Admin from './Components/Admin';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/Login' exact component={Login} />
          <Route path='/Signup' exact component={Signup} />
          <Secure path='/chat' exact component={Dashboard} />
          <AdminSecure path="/admin" exact component={Admin} />
          <Secure path='/swipe' exact component={Swipe} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
