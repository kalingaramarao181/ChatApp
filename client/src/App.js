import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Signin from './Components/Signin';
import Login from './Components/Login';

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
