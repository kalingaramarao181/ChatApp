import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login'
import Signin from './Components/Signin'
import Navbar from './Components/Navbar';

function App() {
  return (
    <>
    <BrowserRouter>
<Navbar/>
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/Login' exact component={Login} />
      <Route path='/Signin' exact component={Signin} />
    </Switch>
    </BrowserRouter>

    </>
  );
}

export default App;
